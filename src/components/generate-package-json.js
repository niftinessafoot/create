import { writeFileSync, readFileSync, access, existsSync } from 'fs';
import { format } from 'prettier';

function _buildScripts(config) {
  const { scripts, entry } = config;
  const defaultScripts = {
    build: `rollup -c rollup.config.js -i ${entry}`,
    test: 'jest',
  };
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
    type,
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
  };

  if (type === 'module') {
    packageJson.keywords.push('module');
  }
  if (isReact) {
    packageJson.keywords.push('react');
  }

  let msg;
  let existing = {};

  if (existsSync('./package.json')) {
    msg = 'File already exists.\nMerging unique fields.';
    existing = JSON.parse(readFileSync('./package.json'));
    // TODO: We want the opposite. New keys in generated package.json should be ported over.
    /*     Object.keys(packageJson).forEach((key) => {
      if (!existing.hasOwnProperty(key)) {
        msg += `\n\t• ${key}`;
        existing[key] = packageJson[key];
      }
    }); */
  }
  const output = { ...packageJson, ...existing };

  const str = JSON.stringify(output);
  const packageString = format(str, {
    parser: 'json-stringify',
  });

  writeFileSync('./package.json', packageString, (err) => {
    msg = err;
  });

  return msg || 'Complete!';
}

export { generatePackageJson };
