import * as eta from 'eta';
import * as fs from 'fs';
import * as http from 'http';

import setConfig from './config.js';
import { connectionData } from './napi.js';

setConfig();

interface Options {
  readonly templatePath: string,
  readonly outDir: String,
  readonly fileName: String,
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
  data: string;
  options: Options;

  constructor(data: string, options: Options) {
    this.data = data;
    this.options = options;
  }

  async createFile() {
    const template = fs.readFileSync(this.options.templatePath, 'utf8');
    const result = await eta.render(template, this.data);
    const savePath = `${this.options.outDir}/${this.options.fileName}.ts`;
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
      outDir: "dist",
      fileName: item.meta.key,
    }
    const template = new Template(item, options);
    template.createFile();
  }
} catch (e) {
  console.error(e);
} 
