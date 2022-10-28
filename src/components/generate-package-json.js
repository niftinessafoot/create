import { writeFileSync, readFileSync, access, existsSync } from 'fs';
import { format } from 'prettier';

function _buildScripts(config) {
  const { scripts, entry, src, isTypescript } = config;
  const defaultScripts = {
    build: `rollup -c rollup.config.js -i ${src}/${entry}`,
    test: 'jest',
  };
  if (isTypescript) {
    defaultScripts.types = 'tsc';
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
    files,
    repository,
  };

  if (type === 'module') {
    packageJson.keywords.push('module');
    packageJson.type = type;
  }
  if (isReact) {
    packageJson.keywords.push('react');
  }

  //TODO: Why does this return false?
  console.log({ isTypescript }, entry);
  if (isTypescript) {
    packageJson.keywords.push('typescript');
    packageJson.types = `${dist}/types/index.d.ts`;
  }

  let existing = {};
  let existingMessage;

  if (existsSync('./package.json')) {
    msg('`package.json` already exists.\n', 'warn');
    msg(`Attempting to append missing default properties.\n`);
    existing = JSON.parse(readFileSync('./package.json'));

    const missing = Object.keys(packageJson)
      .filter((ele) => {
        return !Object.keys(existing).includes(ele);
      })
      .sort();

    existingMessage = '✅  `package.json` complete. No fields to merge.';
    if (missing.length) {
      msg(
        `The following default fields have been appended to \`package.json\`:`
      );
      msg(`${fileList(missing)}`);
      existingMessage =
        '✅  `package.json` updated with missing default fields.';
    }
  }

  const mergedConfigs = { ...packageJson, ...existing };
  const rawJson = JSON.stringify(mergedConfigs);
  const packageString = format(rawJson, {
    parser: 'json-stringify',
  });

  let errorMessage;

  writeFileSync('./package.json', packageString, (err) => {
    errorMessage = formatError(err);
  });

  return errorMessage || existingMessage || '✅ `package.json` created.';
}

export { generatePackageJson };
