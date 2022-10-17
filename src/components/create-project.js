import path, { dirname } from 'path';
import chalk from 'chalk';
import { fileURLToPath } from 'url';

import dependencies from '../dependencies.json' assert { type: 'json' };
import { generateConfig } from './generate-config.js';
import { generateDirectories } from './generate-directories.js';
import { generatePackageJson } from './generate-package-json.js';
import { copyFiles } from './copy-files.js';
import { installDependencies } from './install-dependencies.js';

const formatError = (err) => `🚨  ${red(err)}`;
const formatWarning = (warn) => `⚠️  ${yellow(warn)}`;
const fileList = (arr) => arr.map((ele) => `  • ${ele}`).join('\n');

const { log, warn, error, dir, group, groupEnd, clear } = console;
const { green, red, yellow, cyan, bold, dim } = chalk;
const _ = `\n`;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const msg = (message, code) => {
  switch (code) {
    case 'err':
      error(formatError(message));
      break;
    case 'warn':
      error(formatWarning(message));
      break;
    default:
      log(message);
  }
};

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
  license: 'MIT',
};
const internalConfig = {
  __dirname,
  __filename,
  msg,
  formatError,
  fileList,
  get isReact() {
    const reg = /(j|t)sx/;
    const str = this.entry?.split('.').pop();
    return reg.test(str);
  },
  get isModule() {
    return this.type === 'module';
  },
};
const config = {
  src: 'src',
  dist: 'dist',
  entry: 'index.ts',
  type: 'module',
  directories: ['__tests__', 'src'],
  siteDirectories: ['functions', 'src/js', 'src/styles'],
  reactDirectories: ['src/components'],
  ...packageMeta,
  ...internalConfig,
};

/** Initializer. Calls out separated methods. */
async function init() {
  clear();

  /* Generate Config */
  group(bold('⚙️  Configuring new project'));
  log(_);
  /**
   * Section: Generating configuration.
   * @remarks
   * Builds config object using defaults from {@link config} and inputs passed into the `npx` call.
   */
  const settings = generateConfig(config);

  log('Building with the following params:');
  dir(settings);
  log(_);
  groupEnd();

  /**
   * Section: Subdirectories
   * @remarks
   * Generates common subdirectories. isReact and isModule generate subdirectories beyond the base setup.
   */
  group(bold(`📂  Generating directories`));
  const directoryOutput = await generateDirectories(settings);
  console.dir(directoryOutput);
  log(_);
  groupEnd();

  group(bold(`📝  Initializing NPM project for ${cyan(config.name)}`));
  const packageOutput = generatePackageJson(config);
  log(packageOutput);
  log(_);
  groupEnd();

  group(bold('Copying config files.'));
  const copyOutput = copyFiles(config);
  log(`\nThe following files have been copied over:\n${green(copyOutput)}`);
  log(_);
  groupEnd();

  group(bold('Installing Base Dependencies'));
  const installOutput = await installDependencies(config, dependencies);
  log(installOutput);
  log(_);
  groupEnd();

  log(bold(`✨  Done! Go forth and build snazziness!`));
  log(_);
}

export { init };
