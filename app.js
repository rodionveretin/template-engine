import * as eta from 'eta';
import * as fs from 'fs';
import * as http from 'http';

import './config.js';
import { connectionData } from './napi.js';
// const fileContent = fs.readFileSync("inputs/data.json", "utf8"); // получение данных

let jsonData;

const options = {
  headers: {
    'Authorization': 'Basic ' + connectionData.encodedCredential,
  }
}

const apiCall = new Promise((resolve, reject) => {
  let data = '';
  http.get(connectionData.url, options, res => {
    res.on('data', (chunk) => { data += chunk });
    res.on('end', () => {
      resolve(data);
    });
  }).on('error', (e) => {
    reject(e);
  });
});

try {
  jsonData = await apiCall;
} catch (e) {
  console.error(e);
} finally {
  const result = JSON.parse(jsonData);

  // const fields = [];

  // for (const table of result['dataBlock']) {
  //   for (const [field, value] of Object.entries(table['data'])) {
  //     if (!fields.includes(field)) {
  //       fields.push(field);
  //     }
  //   }
  // }

  // for (let i = 0; i < fields.length; i += 1) {
  //   fields[i] = `${fields[i]}: any;`;
  // }

  // fs.writeFileSync('templates/template.ts', fields.join('\n'));

  // fs.writeFileSync('tmp/objects.json', JSON.stringify(result['dataBlock']));

  // fs.writeFileSync('tmp/objects.json', JSON.stringify(result['dataBlock']));

  const template = fs.readFileSync('templates/template.ts', 'utf8');
  for (const item of result.dataBlock) {
    const result = await eta.render(template, item);
    fs.writeFileSync(`dist/${item.meta.key}.ts`, result);
  }

  // fs.writeFileSync(`dist/${result.dataBlock.meta.key}.ts`, result);

  // console.log(result.dataBlock);
}
