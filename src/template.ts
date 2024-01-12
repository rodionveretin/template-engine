import * as fs from 'fs';
import { Eta } from 'eta';
import { Eta as EtaCore } from '../node_modules/eta/dist/types/index.js';
import { Params } from './interfaces/config.js';

type JSONValue =
  | string
  | number
  | boolean
  | { [x: string]: JSONValue }
  | Array<JSONValue>;

export class Template {
  readonly engine: EtaCore;
  readonly data: JSONValue | Record<string, never>;

  readonly entry: string;
  readonly splitResult: boolean;

  readonly titleField: string;
  readonly postfix: string;
  readonly sanitizeFunc: string;

  readonly template: string;
  readonly outputDir: string;

  constructor(engine: EtaCore, data: JSONValue | Record<string, never>, params: Params, template: string, outputDir: string) {
    this.engine = engine;
    this.entry = params.entry;
    this.titleField = params.name.titleField;
    this.postfix = params.name.postfix;
    this.sanitizeFunc = params.name.function;
    this.data = this.entry ? this.getDataByPath(data, this.entry) : data;
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
      for (let i = 0; i < Object.keys(this.data).length; i++) {
        const dataItem = this.data[i];
        const result = this.renderFile(dataItem);
        content += result;
        const unsanitizedName = this.getDataByPath(dataItem, this.titleField);
        const savePath = this.createFilePath(unsanitizedName, this.postfix, this.sanitizeFunc);
        if (this.splitResult === true) {
          fs.writeFileSync(savePath, <string>result);
        }
      }

      if (this.splitResult === false) {
        fs.writeFileSync(`${this.outputDir}/Result${this.postfix}.ts`, <string>content);
      }
    }
  }

  createFilePath(name: JSONValue, postfix?: string, sanitizeFunc?: string): string {
    const sanitizedName = sanitizeFunc ? this.sanitizeName(name, sanitizeFunc) : name;
    return `${this.outputDir}/${sanitizedName}${postfix}.ts`;
  }

  sanitizeName(name: JSONValue, sanitizeFunc: string): string {
    const eta = new Eta({
      views: 'templates',
    });
    const result = eta.render(`utils/${sanitizeFunc}.eta`, { name: name });
    console.log(result);
    return result;
  }

  getDataByPath(data: JSONValue, dataPath: string): JSONValue {
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