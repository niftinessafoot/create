import { writeFileSync, readFileSync, existsSync } from 'fs';
import { format } from 'prettier';
import { CONSTANTS } from '../constants.js';

const typesPath = `./types/index.d.ts`;

function _buildExports(config) {
  const { dist, isTypescript } = config;
  const output = {};

  const exports = {
    '.': {
      require: `${dist}/umd/index.js`,
      import: `${dist}/esm/index.js`,
      default: `${dist}/umd/index.js`,
    },
  };

  if (isTypescript) {
    exports['.']['types'] = typesPath;
  }

  const dirs = {
    module: `${dist}/umd/index.js`,
    main: `${dist}/umd/index.js`,
    exports,
  };

  Object.assign(output, dirs);

  return output;
}

function _buildScripts(config) {
  const { scripts, entry, src, dist, isTypescript, isModule } = config;

  const defaultScripts = {
    build: `rollup -c rollup.config.js -i ${src}/${entry}`,
    test: 'jest',
    'test:coverage': 'jest --coverage',
    clean: `rm -f ${dist}/*`,
  };
  const siteScripts = {
    build: 'webpack --node-env production',
    dev: 'webpack -w',
    start: 'webpack serve',
    'start:prod': 'webpack serve --node-env production',
  };

  const moduleScripts = {
    'prebuild:prod': 'npm run clean',
    'build:prod': 'npm run build && npm run types',
    'build:dev': `rollup -c rollup.config.dev.js -i ${src}/${entry}`,
    prepack: 'npm run build:prod && npm run prep:umd',
    docs: 'typedoc',
    'prep:umd': 'node ./lib/init-umd-config.js',
    watch: 'nodemon --exec "npm run build:dev" --watch src/ -e ts,js',
  };

  const outputScripts = isModule ? moduleScripts : siteScripts;

  if (isTypescript) {
    defaultScripts.types = 'tsc';
  }

  return { ...defaultScripts, ...outputScripts, ...scripts };
}

function generatePackageJson(config) {
  const {
    name,
    scope,
    isReact,
    isTypescript,
    isModule,
    msg,
    fileList,
    dist,
    src,
  } = config;

  const corePackageMeta = {
    name: `${scope}/${name}`,
    version: '0.1.0',
    description: '',
    keywords: [],
    homepage: `https://github.com/niftinessafoot/${name}`,
    bugs: `https://github.com/niftinessafoot/${name}`,
    license: 'MIT',
    author: 'Matthew Smith <code@niftinessafoot.com> (https://www.afoot.dev)',
    files: [`${dist}/`],
    repository: {
      type: 'git',
      url: `https://github.com/niftinessafoot/${name}`,
    },
    private: true,
  };

  const externalPackageMeta = {
    browserslist: ['defaults'],
    type: 'module',
  };

  const packageMeta = { ...corePackageMeta, ...externalPackageMeta };

  const keywords = [];
  const scripts = { scripts: _buildScripts(config) };

  if (isModule) {
    const moduleMeta = {
      files: [`${dist}/`],
    };
    const exports = _buildExports(config);

    Object.assign(packageMeta, moduleMeta, exports, scripts);

    keywords.push('module');
  }

  if (isReact) {
    keywords.push('react');
  }

  if (isTypescript) {
    keywords.push('typescript');
    packageMeta['types'] = typesPath;
  }

  let existing = {};
  let existingMessage;

  if (existsSync('./package.json')) {
    msg(CONSTANTS.generatePackageJson.existsOne, 'warn');
    msg(CONSTANTS.generatePackageJson.existsTwo);
    existing = JSON.parse(readFileSync('./package.json'));

    const missing = Object.keys(packageMeta)
      .filter((ele) => {
        return !Object.keys(existing).includes(ele);
      })
      .sort();

    existingMessage = CONSTANTS.generatePackageJson.completeExisting;
    if (missing.length) {
      msg(CONSTANTS.generatePackageJson.defaultRecap);
      msg(`${fileList(missing)}`);
      existingMessage = CONSTANTS.generatePackageJson.completeMerged;
    }
  }

  packageMeta.keywords = [...packageMeta.keywords, ...keywords];

  const mergedConfigs = { ...packageMeta, ...existing };

  const rawJson = JSON.stringify(mergedConfigs);
  const packageString = format(rawJson, {
    parser: 'json-stringify',
  });

  let errorMessage;

  try {
    writeFileSync('./package.json', packageString);
  } catch (error) {
    errorMessage = error; //formatError(error);
  }

  return (
    errorMessage || existingMessage || CONSTANTS.generatePackageJson.success
  );
}

export { generatePackageJson };
