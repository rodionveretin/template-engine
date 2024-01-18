import * as fs from 'fs';
import { Eta } from 'eta';
import { Eta as EtaCore } from '../node_modules/eta/dist/types/index.js';
import { Params } from './interfaces/config.js';

/** Объект JSON. */
type JSONValue =
  | string
  | number
  | boolean
  | { [x: string]: JSONValue }
  | Array<JSONValue>;

/** Класс, работающий с шаблонами. */
export class Template {
  /** Экземпляр класса шаблонизатора. */
  readonly engine: EtaCore;
  /** Данные из запроса. */
  readonly data: JSONValue | Record<string, never>;

  /** Путь к объекту с обрабатываемыми данными. */
  readonly entry: string;
  /** Флаг разделения результата. */
  readonly splitResult: boolean;

  /** Путь к названию файла. */
  readonly titleField: string;
  /** Расширение файлов результата. */
  readonly extension: string;
  /** Постфикс названия. */
  readonly postfix: string;
  /** Функция обработки названия. */
  readonly sanitizeFunc: string;

  /** Путь к шаблону. */
  readonly template: string;
  /** Директория для сохранения. */
  readonly outputDir: string;

  /**
   * Конструктор класса `Template`.
   * @param {EtaCore} engine Экземпляр класса шаблонизатора.
   * @param {JSONValue} data Данные в формате JSON.
   * @param {Params} params Параметры генерации.
   * @param {string} template Путь к шаблону.
   * @param {string} outputDir Директория для сохранения.
   */
  constructor(engine: EtaCore, data: JSONValue | Record<string, never>, params: Params, template: string, outputDir: string) {
    this.engine = engine;
    this.entry = params.entry;
    this.titleField = params.name.titleField;
    this.extension = params.name.extension || '.ts';
    this.postfix = params.name.postfix;
    this.sanitizeFunc = params.name.function;
    this.data = this.entry ? this.getDataByPath(data, this.entry) : data;
    this.splitResult = params.splitResult;
    this.template = template;
    this.outputDir = this.sanitizePath(outputDir);
    this.handleFiles();
  }

  /**
   * Очищает путь к файлу.
   * @param {string} path - Неочищенный путь.
   * @returns Возвращает путь без слеша в конце.
   */
  sanitizePath(path: string): string {
    const regex = /\/$/;
    return path.replace(regex, '');
  }

  /** Обрабатывает переданные данные. */
  handleFiles(): void {
    if (Object.keys(this.data).length !== 0) {
      let content = '';
      for (let i = 0; i < Object.keys(this.data).length; i++) {
        const dataItem = this.data[i];
        const result = this.renderFile(dataItem);
        content += result;
        const unsanitizedName = this.getDataByPath(dataItem, this.titleField);
        const savePath = this.createFilePath(unsanitizedName, this.extension, this.postfix, this.sanitizeFunc);
        if (this.splitResult === true) {
          fs.writeFileSync(savePath, <string>result);
        }
      }

      if (this.splitResult === false) {
        fs.writeFileSync(`${this.outputDir}/Result${this.postfix}${this.extension}`, <string>content);
      }
    }
  }

  /**
   * Возвращает обработанное имя создаваемого файла.
   * @param {JSONValue} name - Имя файла из конфига.
   * @param {string} [extension] - Расширение файла.
   * @param {string} [postfix] - Постфикс названия.
   * @param {string} [sanitizeFunc] - Функция для обработки.
   * @returns Путь к сохранямому файлу.
   */
  createFilePath(name: JSONValue, extension: string, postfix?: string, sanitizeFunc?: string): string {
    const sanitizedName = sanitizeFunc ? this.sanitizeName(name, sanitizeFunc) : name;
    return `${this.outputDir}/${sanitizedName}${postfix}${extension}`;
  }

  /**
   * Возвращает обработанное имя создаваемого файла.
   * @param name - Имя файла из конфига.
   * @param sanitizeFunc - Шаблон для обработки из конфига.
   * @returns Имя файла.
   */
  sanitizeName(name: JSONValue, sanitizeFunc: string): string {
    const eta = new Eta({
      views: 'utils',
    });
    const result = eta.render(`${sanitizeFunc}.eta`, { name: name });
    return result;
  }

  /**
   * Получает данные по указанному пути.
   * @param {string} data - Объект с результатом запроса.
   * @param {string} dataPath - Путь к данным.
   * @returns Объект с данными.
   */
  getDataByPath(data: JSONValue, dataPath: string): JSONValue {
    const keys = dataPath.split('.');
    let value: JSONValue = data;
    for (const key of keys) {
      value = value[key];
    }
    return value;
  }

  /**
   * Рендерит полученные данные.
   * @param {object} data - Объект данных.
   * @returns Содержимое файла.
   */
  renderFile(data: object): string {
    const template = fs.readFileSync(this.template, 'utf8');
    return this.engine.render(template, data);
  }
}