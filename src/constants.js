export const CONSTANTS = {
  writeStarterFile: {
    msg: {
      init: (filePath) => `Generating new entry file at ${filePath}`,
      success: (filePath) => `✅ Generated ${filePath} with placeholder code.`,
      fail: (filePath) => `${filePath} already exists. Will not overwrite.`,
    },
    baseFunction: (returnType = '') =>
      `export function fn()${returnType}{return true};`,
    reactFunction: (returnType = '') =>
      `import React from 'react'; export function fn()${returnType}{return <div>hello world</div>}`,
    reactSiteFunction: (returnType = '') =>
      `import React from 'react'; import {createRoot} from 'react-dom/client'; createRoot(document.getElementById('wrapper')).render(<div>hello world</div>)`,
  },
  generateReadme: {
    content: (name, description) =>
      [
        `# ${name}`,
        `${description}`,
        `## usage`,
        `## license`,
        `[MIT](./LICENSE) © [Matthew Smith](http://www.niftinessafoot.com)`,
        `## made with ❤️ and ☕️ by`,
        `![Niftiness Afoot!](https://gist.githubusercontent.com/niftinessafoot/2dba588395cb557293d5f09aebcd2ab0/raw/770293c76bead4f0986ff959f3ea8880017d92c0/bot.svg?sanitize=true) [Matthew Smith](https://github.com/niftinessafoot)`,
      ].join('\n'),
    success: '✅  Generated `README.md`',
    fail: '`README.md` already exists. Will not overwrite.',
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
