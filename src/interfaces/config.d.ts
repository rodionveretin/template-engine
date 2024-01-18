/**
 * Интерфейс данных для подключения.
 * @param {boolean} cache - Кешировать ли шаблоны.
 * @param {[string, string]} tags - Теги шаблона: в формате `['<%', '%>']`.
 * @param {string} varName - Имя объекта в шаблоне, по умолчанию `it`.
 * @param {string} views - Директория, содержащая шаблоны.
 * @param {string} defaultExtension - Расширение шаблона, по умолчанию `.eta`.
 */
interface EtaConfig {
  cache: boolean;
  tags: [string, string];
  varName: string;
  views: string;
  defaultExtension?: string;
}

/**
 * Интерфейс данных для подключения.
 * @param {string} url - Url запроса.
 * @param {string} [credential] - Данные для подключения в формате Base64.
 */
interface Api {
  url: string,
  credential?: string,
}

/**
 * Интерфейс названия файла.
 * @param {string} titleField - Поле в объекте данных, содержащее название.
 * @param {string} [extension] - Расширение файла, по умолчанию `.ts`.
 * @param {string} [postfix] - Постфикс после названия.
 * @param {string} [function] - Функция обработки названия.
 */
interface Filename {
  titleField: string,
  extension?: string,
  postfix?: string,
  function?: string,
}

/**
 * Интерфейс параметров обработки данных.
 * @param {string} [entry] - Путь к объекту с данными.
 * @param {boolean} splitResult - Разделять ли результат в отдельные файлы.
 * @param {Filename} name - Параметры именования генерируемых файлов.
 */
interface Params {
  entry?: string,
  splitResult: boolean,
  name: Filename,
}

/**
 * Интерфейс параметров генерации.
 * @param {Api} api - Параметры API.
 * @param {Params} params - Вспомогательные параметры генерации.
 * @param {string} template - Путь к шаблону.
 * @param {outputDir} [outputDir] - Директория для сохранения, по умолчанию `dist`.
 */
interface Data {
  api: Api,
  params: Params,
  template: string,
  outputDir?: string,
}

export { EtaConfig, Data, Params };
