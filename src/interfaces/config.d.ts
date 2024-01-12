type trimConfig = "nl" | "slurp" | false;

interface EtaConfig {
  autoEscape: boolean;
  autoFilter: boolean;
  autoTrim: trimConfig | [trimConfig, trimConfig];
  cache: boolean;
  cacheFilepaths: boolean;
  debug: boolean;
  escapeFunction: (str: unknown) => string;
  filterFunction: (val: unknown) => string;
  functionHeader: string;
  parse: {
    exec: string;
    interpolate: string;
    raw: string;
  };
  plugins: Array<{
    processFnString?: Function;
    processAST?: Function;
    processTemplate?: Function;
  }>;
  rmWhitespace: boolean;
  tags: [string, string];
  useWith: boolean;
  varName: string;
  views?: string;
  defaultExtension?: string;
}

interface Api {
  url: string,
  credential?: string,
}

interface Filename {
  titleField: string,
  postfix?: string,
  function?: string,
}

interface Params {
  entry?: string,
  splitResult: boolean,
  name: Filename,
}

interface Data {
  api: Api,
  params: Params,
  template: string,
  outputDir?: string,
}

export { EtaConfig, Data, Params };
