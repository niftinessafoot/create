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
};
