export const CONSTANTS = {
  writeFiles: {
    msg: {
      init: (filePath) => `Generating new entry file at ${filePath}`,
      success: (filePath) => `✅ Generated ${filePath} with placeholder code.`,
      fail: (filePath) => `${filePath} already exists. Will not overwrite.`,
    },
    baseFunction: (returnType = '') =>
      `export function fn()${returnType}{return true};`,
    reactFunction: (returnType = '') =>
      `import React from 'react'; export function fn()${returnType}{return <div>hello world</div>}`,
  },
  copyFiles: {
    failCopy: (file) => `\`${file}\` already exists. Generating backup.`,
    failDuplicate: (file) => `\`${file}\` already exists. No new file copied.`,
    outputSuccess: '✅  The following files have been copied over:',
    outputFail: '✅  No new files copied.',
  },
  generatePackageJson: {
    defaultRecap: `The following default fields have been appended to \`package.json\`:`,
    existsOne: '`package.json` already exists.\n',
    existsTwo: `Attempting to append missing default properties.\n`,
    completeExisting: '✅  `package.json` complete. No fields to merge.',
    completeMerged: '✅  `package.json` updated with missing default fields.',
    success: '✅ `package.json` created.',
  },
  installDependencies: {
    installList: (modifier, list) =>
      `Running 'npm i ${modifier}' on: \n${list}\n`,
    error: (list) => `Installation Errors\n\nCould not install: ${list}\n\n`,
    fail: (category) => `⚠️ Issues with ${category} Installation`,
    success: (category) => `${category} Complete`,
  },
};
