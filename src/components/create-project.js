import path, { dirname } from 'path';
import chalk from 'chalk';
import execSync from 'child_process';
import { fileURLToPath } from 'url';

import dependencies from '../dependencies.json' assert { type: 'json' };
import { generateConfig } from './generate-config.js';
import { generateDirectories } from './generate-directories.js';
import { generatePackageJson } from './generate-package-json.js';
/* import { installDependencies } from './install-dependencies.js';
 */
import { copyFiles } from './copy-files.js';

const formatError = (err) => `\n🚨  ${red(err)}\n`;
const errorCallback = (err) => err && console.error(formatError(err));

const { log, warn, error, dir, group, groupEnd, clear } = console;
const { green, red, yellow, cyan, bold, dim } = chalk;
const _ = `\n`;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
  directories: ['__tests__', 'src'],
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
  get url() {
    return import.meta.url;
  },
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

  /*   group(bold('Copying config files.'));
  copyFiles(config);
  log(_);
  groupEnd(); */

  /*   group(bold('Installing Base Dependencies'));
  const installOutput = await installDependencies(config, dependencies);
  log(`npm Output:`);
  log(installOutput);
  log(_);
  groupEnd(); */

  log(bold(`✨  Done! Go forth and build snazziness!`));
  log(_);
}

export { init };
