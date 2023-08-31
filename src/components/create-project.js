import { dirname } from 'path';
import chalk from 'chalk';
import { fileURLToPath } from 'url';

import dependencies from '../dependencies.json' assert { type: 'json' };
import { generateConfig } from './generate-config.js';
import { generateDirectories } from './generate-directories.js';
import { generatePackageJson } from './generate-package-json.js';
import { copyFiles, generateReadme, writeStarterFile } from './copy-files.js';
import { installDependencies } from './install-dependencies.js';
import minimist from 'minimist';

const formatError = (err) => `🚨  ${red(err)}`;
const formatWarning = (warn) => `⚠️  ${yellow(warn)}`;
const fileList = (arr) => arr.map((ele) => `  • ${green(ele)}`).join('\n');
// TODO: Move message formatting out into separate component.

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

const internalConfig = {
  __dirname,
  __filename,
  msg,
  formatError,
  formatWarning,
  fileList,
};
const baseConfig = {
  src: './src',
  dist: './dist',
  entry: 'index.js',
  scope: '@afoot',
  isModule: true,
  directories: ['__tests__', 'src'],
  siteDirectories: ['functions', 'src/js', 'src/styles', 'src/pages'],
  reactDirectories: ['src/components'],
  ...internalConfig,
};

// TODO: Ensure `files/lib/*` copies over to new projects.
// TODO: Ensure `.github/**/*` copies over to new projects.
// TODO: Initialize .git repository.
// TODO: Update package.json URLS with correct project name

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
   * Builds config object using defaults from {@link baseConfig} and inputs passed into the `npx` call.
   */
  const settings = generateConfig(baseConfig);

  log('Building with the following params:');
  const displayConfigs = minimist(process.argv.slice(2));
  delete displayConfigs['_'];

  dir(displayConfigs);
  log(_);
  groupEnd();

  /**
   * Section: Generate package.json
   */
  group(bold(`📝  Initializing NPM project for ${cyan(settings.name)}`));
  const packageOutput = generatePackageJson(settings);
  log(packageOutput);
  log(_);
  groupEnd();

  return true;

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
