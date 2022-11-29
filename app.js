import * as eta from 'eta';
import * as fs from 'fs';

import './config.js';

const fileContent = fs.readFileSync("inputs/data.json", "utf8"); // получение данных

let jsonData;

try {
  jsonData = JSON.parse(fileContent); // парсинг json
  const template = fs.readFileSync(`templates/${jsonData.dataBlock.meta.key}.txt`, "utf8"); // получение шаблона из templates

  const result = await eta.render(template, jsonData);  // генерация результата

  fs.writeFileSync(`outputs/${jsonData.dataBlock.meta.key}.ts`, result);

} catch (e) {
  console.error(e);
}
