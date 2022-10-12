import { writeFileSync, readFileSync, access, existsSync } from 'fs';
import prettier from 'prettier';
// import { formatError } from './utils.js';

function _buildScripts(config) {
  const scripts = {
    build: `rollup -c rollup.config.js -i ${config.entry}`,
  };
  return scripts;
}

function generatePackageJson(config) {
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
    scripts: _buildScripts(config),
  };

  if (type === 'module') {
    packageJson.keywords.push('module');
  }
  if (isReact) {
    packageJson.keywords.push('react');
  }

  let msg;

  if (existsSync('./package.json')) {
    msg = 'File already exists.\nMerging unique fields.';
    const existing = JSON.parse(readFileSync('./package.json'));
    // TODO: We want the opposite. New keys in generated package.json should be ported over.
    Object.keys(existing).forEach((key) => {
      if (!packageJson.hasOwnProperty(key)) {
        msg += `\n\t• ${key}`;
        packageJson[key] = existing[key];
      }
    });
  }

  const str = JSON.stringify(packageJson);
  const packageString = prettier.format(str, {
    parser: 'json-stringify',
  });

  writeFileSync('./package.json', packageString, (err) => {
    msg = err;
  });

  return msg || 'Complete!';
}

export { generatePackageJson };
