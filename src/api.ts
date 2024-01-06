import * as http from 'http';
import * as https from 'https';
import { Headers } from './interfaces/api.js';

export class API {
  readonly url: string;
  readonly credential: string;
  readonly options: Headers | Record<string, never>;

  constructor(url: string, credential?: string) {
    this.url = url;
    this.credential = credential;

    this.options = this.credential ? {
      headers: {
        Authorization: 'Basic ' + this.credential,
      }
    } : {};
  }

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