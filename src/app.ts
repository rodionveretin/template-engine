import * as eta from 'eta';
import * as fs from 'fs';
import * as http from 'http';

import setConfig from './config.js';
import { connectionData } from './napi.js';

setConfig();

interface Options {
  readonly templatePath: string,
  readonly outputDir: string,
  readonly fileName: string,
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
  fileName: string;

  constructor(data: object, options: Options) {
    this.data = data;
    this.templatePath = options.templatePath;
    this.outputDir = options.outputDir;
    this.fileName = options.fileName;
  }

  async createFile() {
    const template = fs.readFileSync(this.templatePath, 'utf8');
    const result = eta.render(template, this.data);
    const savePath = `${this.outputDir}/${this.fileName}.ts`;
    fs.writeFileSync(savePath, <string>result);
  }
}

const apiCall = new API(connectionData.url, connectionData.encodedCredential);

try {
  const data = await apiCall.getData();
  const result = JSON.parse(data);

  for (const item of result.dataBlock) {
    const options: Options = {
      templatePath: "templates/template.ts",
      outputDir: "dist",
      fileName: item.meta.key,
    }
    const template = new Template(item, options);
    template.createFile();
  }
} catch (e) {
  console.error(e);
} 