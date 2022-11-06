import * as eta from 'eta';
import * as fs from 'fs';

import './config.js'


const fileContent = JSON.parse(fs.readFileSync("inputs/data.json", "utf8")); // парсинг json из inputs

const template = fs.readFileSync("templates/template_1.txt", "utf8"); // получение шаблона из templates

const result = eta.render(template, fileContent);  // генерация результата

fs.writeFileSync("outputs/result.ts", result);