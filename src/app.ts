import * as eta from 'eta';
import * as fs from 'fs';
import * as http from 'http';

import setConfig from './config.js';
import { connectionData } from './napi.js';

setConfig();

interface Options {
  readonly templatePath: string,
  readonly outputDir: string,
  readonly splitResult: boolean,
}

class API {
  url: string;
  credential: string;
  options: object;

  constructor(url: string, credential: string) {
    this.url = url;
    this.credential = credential;
    this.options = {
      headers: {
        'Authorization': 'Basic ' + connectionData.encodedCredential,
      }
    }
  }

  getData(): Promise<string> {
    return new Promise((resolve, reject) => {
      let data: string = '';
      http.get(this.url, this.options, res => {
        res.on('data', (chunk: string) => { data += chunk });
        res.on('end', () => {
          resolve(data);
        });
      }).on('error', (e) => {
        reject(e);
      });
    });
  }
}

class Template {
  data: object;
  templatePath: string;
  outputDir: string;
  splitResult: boolean;

  constructor(data: object, options: Options) {
    this.data = data;
    this.templatePath = options.templatePath;
    this.outputDir = this.sanitizePath(options.outputDir);
    this.splitResult = options.splitResult;
  }

  handleFiles() {
    if (this.splitResult === true) {
      for (const item in this.data) {
        const result = this.renderFile(this.data[item]);
        const fileName = this.data[item].meta.key;
        const savePath = `${this.outputDir}/${fileName}.ts`;
        fs.writeFileSync(savePath, <string>result);
      }
    } else if (this.splitResult === false) {
      const result = this.renderFile(this.data);
      const savePath = `${this.outputDir}/result.ts`;
      fs.writeFileSync(savePath, <string>result);
    }
  }

  renderFile(data): string {
    const template = fs.readFileSync(this.templatePath, 'utf8');
    return eta.render(template, data);
  }

  sanitizePath(path): string {
    const regex = /\/$/;
    return path.replace(regex, '');
  }
}

const apiCall = new API(connectionData.url, connectionData.encodedCredential);

try {
  const data = await apiCall.getData();
  const result = JSON.parse(data);

  const options: Options = {
    templatePath: "templates/template.ts",
    outputDir: "dist",
    splitResult: false,
  }
  const template = new Template(result.dataBlock, options);
  template.handleFiles();
} catch (e) {
  console.error(e);
}