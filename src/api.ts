import * as http from 'http';
import * as https from 'https';
import { Headers } from './interfaces/api.js';

/** Класс, запросов к API. */
export class API {
  /** Url запроса. */
  readonly url: string;
  /** Данные для подключения в формате Base64. */
  readonly credential: string;
  /** Заголовки для подключения. */
  readonly options: Headers | Record<string, never>;

  /**
   * Конструктор класса `API`.
   * @param {string} url Url запроса.
   * @param {string} credential Данные для подключения в формате Base64.
   */
  constructor(url: string, credential?: string) {
    this.url = url;
    this.credential = credential;

    this.options = this.credential ? {
      headers: {
        Authorization: 'Basic ' + this.credential,
      }
    } : {};
  }

  /**
  * Возвращает результат запроса к API.
  * @results Промис результата запроса к API.
  */
  getData(): Promise<string> {
    const url = new URL(this.url);
    const client = (url.protocol === 'https:') ? https : http;

    return new Promise((resolve, reject) => {
      let data = '';
      client.get(this.url, this.options, res => {
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