import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import { program, Option } from 'commander';
import execSync from 'child_process';
import spawn from 'cross-spawn'; // For longer-running, data-intense jobs.
import prettier from 'prettier';

import dependencies from '../dependencies.json' assert { type: 'json' };
import { installDependencies } from './install-dependencies.js';

const __dirname = fileURLToPath(import.meta.url);
const { log, warn, error, dir, group, groupEnd, clear } = console;
const { green, red, yellow, cyan, bold, dim } = chalk;

const formatError = (err) => `\n🚨  ${red(err)}\n`;
const errorCallback = (err) => err && error(formatError(err));
const sectionEnd = `\n`;

/**
 * Configuration object. Inherits overrides from {#link program}
 */
const packageMeta = {
  name: '@afoot/module',
  version: '0.1.0',
  author: 'Matthew Smith @niftinessafoot',
  description: '',
  private: true,
  keywords: [],
};
const config = {
  src: 'src',
  dist: 'dist',
  entry: 'index.ts',
  type: 'module',
  directories: ['__tests__'],
  siteDirectories: ['functions', 'src/js', 'src/styles'],
  reactDirectories: ['src/components'],
  ...packageMeta,
  get isReact() {
    const reg = /(j|t)sx/;
    const str = this.entry?.split('.').pop();
    return reg.test(str);
  },
  get isModule() {
    return this.type === 'module';
  },
};

/** Initializer. Calls out separated methods. */
async function init() {
  clear();
  group(bold('⚙️  Configuring new project'));
  log();
  program.description('Bootstrap a module, React component, or website.');
  program.option('-n, --name <name>', 'project name', config.name);
  program.option('-s, --src <src>', 'source directory', config.src);
  program.option('-d, --dist <dist>', 'build directory', config.dist);
  program.option('-e, --entry <entry>', 'entry point filename', config.entry);
  program.addOption(
    new Option('-t, --type <type>', 'project type', config.type).choices([
      'module',
      'site',
    ])
  );

  program.configureOutput({
    outputError: (str, write) => {
      return write(errorString(str));
    },
  });
  program.parse();

  Object.assign(config, program.opts());
  log('Building with the following params:');
  dir(program.opts());
  log(sectionEnd);
  groupEnd();

  group(bold(`📂  Generating directories`));
  _generateDirectories(config);
  log(sectionEnd);
  groupEnd();

  group(bold(`📝  Initializing NPM project for ${cyan(config.name)}`));
  const packageOutput = await _generatePackageJSON(config);
  console.log(packageOutput);
  log(sectionEnd);
  groupEnd();

  group(bold('Copying config files.'));
  _copyFiles();
  log(sectionEnd);
  groupEnd();

  group(bold('Installing Base Dependencies'));
  const installOutput = await installDependencies(config, dependencies);
  log('npm Output:');
  log(installOutput);
  log(sectionEnd);
  groupEnd();

  log(bold(`✨  Done! Go forth and build snazziness!`));
  log();
}

function _generateDirectories(config) {
  const { directories } = config;
  const { siteDirectories, reactDirectories, type, isReact } = config;
  const success = (...args) => {
    log('success', ...args);
  };

  if (type === 'site') {
    directories.push(...siteDirectories);
  }

  if (isReact) {
    directories.push(...reactDirectories);
  }

  directories.forEach((dir) => {
    //TODO: Make this async.
    fs.ensureDirSync(dir);
  });

  return true;
}

function _copyFilesFilter(src, dest) {
  return true;
}

function _copyFiles() {
  fs.copy(`${__dirname}/files`, './', errorCallback);
}

function _generatePackageJSON() {
  const { name, version, description, author, keywords, entry, isReact, type } =
    config;
  const packageJson = {
    name,
    version,
    description,
    author,
    keywords,
    entry,
    license: 'MIT',
    scripts: _buildScripts(),
  };

  if (type === 'module') {
    packageJson.keywords.push('module');
  }
  if (isReact) {
    packageJson.keywords.push('react');
  }

  const str = JSON.stringify(packageJson);
  const packageString = prettier.format(str, {
    parser: 'json-stringify',
  });

  fs.outputFile('package.json', packageString, formatError);

  return;
}

function _buildScripts() {
  const scripts = {
    build: `rollup -c rollup.config.js -i ${config.entry}`,
  };
  return scripts;
}

export { init };
