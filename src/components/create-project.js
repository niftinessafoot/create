import { dirname } from 'path';
import chalk from 'chalk';
import { fileURLToPath } from 'url';

import dependencies from '../dependencies.json' assert { type: 'json' };
import { generateConfig } from './generate-config.js';
import { generateDirectories } from './generate-directories.js';
import { generatePackageJson } from './generate-package-json.js';
import { copyFiles, generateReadme, writeStarterFile } from './copy-files.js';
import { installDependencies } from './install-dependencies.js';

const formatError = (err) => `🚨  ${red(err)}`;
const formatWarning = (warn) => `⚠️  ${yellow(warn)}`;
const fileList = (arr) => arr.map((ele) => `  • ${green(ele)}`).join('\n');

const { log, dir, group, groupEnd, clear } = console;
const { green, red, yellow, cyan, bold, dim } = chalk;
const _ = `\n`;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const msg = (message, code) => {
  const { log, error, warn } = console;

  switch (code) {
    case 'err':
      error(formatError(message));
      break;
    case 'warn':
      warn(formatWarning(message));
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
  author:
    'Matthew Smith <code@niftinessafoot.com> (https://www.niftinessafoot.com)',
  description: '',
  entry: 'index.ts',
  private: true,
  keywords: [],
  license: 'MIT',
  type: 'module',
  browserslist: ['defaults'],
  files: [],
  repository: {
    type: 'git',
    url: 'https://github.com/niftinessafoot/',
  },
  homepage: 'https://github.com/niftinessafoot/',
};
const internalConfig = {
  __dirname,
  __filename,
  msg,
  formatError,
  formatWarning,
  fileList,
};
const config = {
  src: 'src',
  dist: 'dist',
  directories: ['__tests__', 'src'],
  siteDirectories: ['functions', 'src/js', 'src/styles', 'src/pages'],
  reactDirectories: ['src/components'],
  ...packageMeta,
  ...internalConfig,
};

/* Because the getters are used in other files, they need to be bound to `config`—they lose `this` on import.*/
Object.defineProperty(config, 'isReact', {
  get: function () {
    const reg = /(j|t)sx/;
    const str = this.entry?.split('.').pop();
    return reg.test(str);
  }.bind(config),
});

Object.defineProperty(config, 'isTypescript', {
  get: function () {
    const reg = /tsx?/;
    const str = this.entry?.split('.').pop();
    return reg.test(str);
  }.bind(config),
});

Object.defineProperty(config, 'isModule', {
  get: function () {
    return this.type === 'module';
  }.bind(config),
});

/** Initializer. Calls out separated methods. */
async function init() {
  clear();

  /* Generate Config */
  log(_);
  group(bold('⚙️  Configuring new project'));
  log(''.padEnd(25, '_'));
  log(_);
  /**
   * Section: Generating configuration.
   * @remarks
   * Builds config object using defaults from {@link config} and inputs passed into the `npx` call.
   */
  const settings = generateConfig(config);

  log('Building with the following params:');
  dir(packageMeta);
  log(_);
  groupEnd();

  /**
   * Section: Subdirectories
   * @remarks
   * Generates common subdirectories. isReact and isModule generate subdirectories beyond the base setup.
   */
  group(bold(`📂  Generating directories`));
  const directoryOutput = await generateDirectories(settings);
  log(fileList(directoryOutput));
  log(_);
  groupEnd();

  group(bold(`📝  Initializing NPM project for ${cyan(settings.name)}`));
  const packageOutput = generatePackageJson(settings);
  log(packageOutput);
  log(_);
  groupEnd();

  group(bold('👯‍♀️ Copying config files.'));
  const copyOutput = copyFiles(settings);
  log(_);
  log(copyOutput);
  log(_);
  const writeOutput = writeStarterFile(settings);
  log(writeOutput);
  log(_);
  const readmeOutput = generateReadme(settings);
  log(readmeOutput);
  log(_);
  groupEnd();

  group(bold('🧱 Installing Dependencies'));
  const installOutput = await installDependencies(settings, dependencies);
  log(installOutput);
  log(_);
  groupEnd();

  log(bold(`✨  Done! Go forth and build snazziness!`));
  log(_);
}

export { init };
