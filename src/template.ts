import * as fs from 'fs';
import { Eta } from '../node_modules/eta/dist/types/index.js';
import { Params } from './interfaces/config.js';

type JSONValue =
  | string
  | number
  | boolean
  | { [x: string]: JSONValue }
  | Array<JSONValue>;

export class Template {
  readonly engine: Eta;
  readonly data: JSONValue | Record<string, never>;

  readonly entry: string;
  readonly splitResult: boolean;

  readonly template: string;
  readonly outputDir: string;

  constructor(engine: Eta, data: JSONValue | Record<string, never>, params: Params, template: string, outputDir: string) {
    this.engine = engine;
    this.entry = params.entry;
    this.data = this.entry ? this.getDataByRoot(data, this.entry) : data;
    this.splitResult = params.splitResult;
    this.template = template;
    this.outputDir = this.sanitizePath(outputDir);
    this.handleFiles();
  }

  sanitizePath(path: string): string {
    const regex = /\/$/;
    return path.replace(regex, '');
  }

  handleFiles() {
    if (Object.keys(this.data).length !== 0) {
      let content = '';
      const date = Date.now();
      for (let i = 0; i < Object.keys(this.data).length; i++) {
        const dataItem = this.data[i];
        const result = this.renderFile(dataItem);
        content += result;
        if (this.splitResult === true) {
          const fileName = i;
          const savePath = `${this.outputDir}/${date}_${fileName}.ts`;
          fs.writeFileSync(savePath, <string>result);
        }
      }

      if (this.splitResult === false) {
        fs.writeFileSync(`${this.outputDir}/${date}_united.ts`, <string>content);
      }
    }
  }

  getDataByRoot(data: JSONValue, dataPath: string): JSONValue {
    const keys = dataPath.split('.');
    let value: JSONValue = data;
    for (const key of keys) {
      value = value[key];
    }
    return value;
  }

  renderFile(data: object): string {
    const template = fs.readFileSync(this.template, 'utf8');
    return this.engine.render(template, data);
  }
}