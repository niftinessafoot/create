import { Command, Option } from 'commander';
import { errorCallback, errorFormat } from './utils.js';
const program = new Command();

/**
 *
 * @param {Object} config Default config object.
 * @returns {Object} Modified config object.
 */
function generateConfig(config) {
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
      write(str);
    },
    writeErr: (str) => process.stderr.write(errorFormat(str)),
  });

  program.parse();

  return Object.assign(config, program.opts());
}

export { generateConfig };
