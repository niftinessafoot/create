import { writeFileSync, readFileSync, access, existsSync } from 'fs';
import { format } from 'prettier';
import { CONSTANTS } from '../constants.js';

function _buildScripts(config) {
  const { scripts, entry, src, dist, isTypescript, isModule } = config;
  const defaultScripts = {
    build: `rollup -c rollup.config.js -i ${src}/${entry}`,
    test: 'jest',
    'test:coverage': 'jest --coverage',
    clean: `rm -f ${dist}/*`,
  };

  if (isTypescript) {
    defaultScripts.types = 'tsc';
  }

  if (!isModule) {
    const siteScripts = {
      build: 'webpack --node-env production',
      dev: 'webpack -w',
      start: 'webpack serve --open',
      'start:prod': 'webpack serve --open --node-env production',
    };

    Object.assign(defaultScripts, siteScripts);
  }

  return { ...defaultScripts, ...scripts };
}

function generatePackageJson(config) {
  const {
    name,
    version,
    description,
    author,
    keywords,
    license,
    entry,
    isReact,
    isTypescript,
    isModule,
    type,
    browserslist,
    files,
    repository,
    formatError,
    msg,
    fileList,
    dist,
  } = config;
  const packageJson = {
    name,
    version,
    description,
    author,
    keywords,
    entry,
    license,
    scripts: _buildScripts(config),
    browserslist,
    repository,
  };

  if (isModule) {
    packageJson.keywords.push('module');
    packageJson.type = type;
    packageJson.files = files;
  }

  if (isReact) {
    packageJson.keywords.push('react');
  }

  if (isTypescript) {
    packageJson.keywords.push('typescript');
    packageJson.types = `${dist}/types/index.d.ts`;
  }

  let existing = {};
  let existingMessage;
  let errorMessage;

  if (existsSync('./package.json')) {
    msg(CONSTANTS.generatePackageJson.existsOne, 'warn');
    msg(CONSTANTS.generatePackageJson.existsTwo);
    existing = JSON.parse(readFileSync('./package.json'));

    const missing = Object.keys(packageJson)
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

  const mergedConfigs = { ...packageJson, ...existing };
  const rawJson = JSON.stringify(mergedConfigs);
  const packageString = format(rawJson, {
    parser: 'json-stringify',
  });

  writeFileSync('./package.json', packageString, (err) => {
    errorMessage = formatError(err);
  });

  return (
    errorMessage || existingMessage || CONSTANTS.generatePackageJson.success
  );
}

export { generatePackageJson };
