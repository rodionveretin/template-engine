import { Eta } from 'eta';
import { API } from './api.js';
import { Template } from './template.js';
import config from './config.json' assert { type: 'json' };
import { EtaConfig, Data } from './interfaces/config.js';

for (let i = 0; i < config.length; i++) {
  const engineOptions = config[i].config as EtaConfig;
  const data: Data = config[i].data;
  const eta = new Eta(engineOptions);

  const query = new API(data.api.url, data.api.credential);
  try {
    const queryResult = await query.getData();
    const parsedResult = JSON.parse(queryResult);
    new Template(eta, parsedResult, data.params, data.template, data.outputDir);
  } catch (e) {
    console.error(`Error: ${e}`);
  }
}