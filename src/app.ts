import * as eta from 'eta';
import * as fs from 'fs';
import * as http from 'http';

import setConfig from './config.js';
import { connectionData } from './napi.js';

setConfig();

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

const apiCall = new API(connectionData.url, connectionData.encodedCredential);

try {
  const data = await apiCall.getData();
  const result = JSON.parse(data);

  const template = fs.readFileSync('templates/template.ts', 'utf8');
  for (const item of result.dataBlock) {
    const result = await eta.render(template, item);
    fs.writeFileSync(`dist/${item.meta.key}.ts`, <string>result);
  }
} catch (e) {
  console.error(e);
} 
