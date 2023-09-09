import {
  readdirSync,
  copyFileSync,
  writeFileSync,
  constants,
  statSync,
  mkdir,
  existsSync,
} from 'fs';
import { format } from 'prettier';
import { CONSTANTS } from '../constants.js';

const errorCallback = (err) => {
  if (err) {
    throw err;
  }
};

function writeStarterFile(config) {
  const { src, entry, isReact, isTypescript, isModule, msg, formatWarning } =
    config;
  const filePath = `./${src}/${entry}`;
  let message;
  let returnType = isTypescript ? ':boolean' : '';

  msg(CONSTANTS.writeStarterFile.msg.init(filePath));

  let rawContent = CONSTANTS.writeStarterFile.baseFunction(returnType);
  if (isReact) {
    returnType = isTypescript ? ': ReactElement' : '';
    if (isModule) {
      rawContent = CONSTANTS.writeStarterFile.reactFunction(returnType);
    } else {
      rawContent = CONSTANTS.writeStarterFile.reactSiteFunction(returnType);
    }
  }

  const formattedContent = format(rawContent, { parser: 'babel-ts' });

  try {
    writeFileSync(filePath, formattedContent, { flag: 'wx' });
    message = CONSTANTS.writeStarterFile.msg.success(filePath);
  } catch (err) {
    message = formatWarning(CONSTANTS.writeStarterFile.msg.fail(filePath));
  }

  return message;
}

function generateReadme(config) {
  const { name, description, formatWarning } = config;

  const rawContent = CONSTANTS.generateReadme.content(name, description);
  const formattedContent = format(rawContent, { parser: 'markdown' });

  let message;

  try {
    writeFileSync('./README.md', formattedContent, { flag: 'wx' });
    message = CONSTANTS.generateReadme.success;
  } catch (err) {
    message = formatWarning(CONSTANTS.generateReadme.fail);
  }

  return message;
}

function generateDisallowList(config) {
  const { isModule, isTypescript } = config;
  const moduleDisallow = ['webpack.config.js', 'webpack.template.html'];
  const siteDisallow = [
    'rollup.config.js',
    'rollup.config.dev.js',
    'lib',
    'lib/init-umd-config.js',
  ];
  const tsDisallow = ['tsconfig.json'];
  const disallowList = [];

  if (isModule) {
    disallowList.push(...moduleDisallow);
  } else {
    disallowList.push(...siteDisallow);
  }

  if (!isTypescript) {
    disallowList.push(...tsDisallow);
  }

  return disallowList;
}

function copyFiles(config) {
  const { _root, _srcRoot, msg, fileList, isModule, isTypescript } = config;
  const fileRoot = `${_srcRoot}/files`;
  const disallowList = generateDisallowList(config);
  const copiedFiles = [];

  function parseFiles(current, prev) {
    const dir = [fileRoot, prev, current].filter(Boolean).join('/');
    const files = readdirSync(dir);

    Array.isArray(files) &&
      files.forEach((file) => {
        const filePath = [prev, current, file].filter(Boolean).join('/');
        const source = `${fileRoot}/${filePath}`;
        const output = `${_root}/${filePath}`;
        const isDirectory = statSync(source).isDirectory();

        if (disallowList.includes(filePath)) {
          return;
        }

        if (isDirectory) {
          if (!existsSync(output)) {
            mkdir(output, errorCallback);
          }
          parseFiles(file, current);
        } else {
          try {
            copyFileSync(source, output, constants.COPYFILE_EXCL);
            copiedFiles.push(filePath);
          } catch (err) {
            if (err.code === 'EEXIST') {
              /* Keep existing files, but generate default files for comparison. */
              msg(CONSTANTS.copyFiles.failCopy(file), 'warn');
              const errorFileArray = file.split('.');
              errorFileArray.splice(-1, 0, `DEFAULT`);
              const duplicateFile = `./${errorFileArray.join('.')}`;
              try {
                /* If default files already exist, do nothing but notify. */
                copyFileSync(source, duplicateFile, constants.COPYFILE_EXCL);
              } catch (err) {
                msg(CONSTANTS.copyFiles.failDuplicate(duplicateFile), 'warn');
              }
              msg('');
            } else {
              throw new Error(err);
            }
          }
        }
      });
  }

  parseFiles();

  const message = CONSTANTS.copyFiles.outputSuccess;
  const emptyMessage = CONSTANTS.copyFiles.outputFail;

  return copiedFiles.length
    ? `${message}\n${fileList(copiedFiles)}`
    : emptyMessage;
}
export { copyFiles, writeStarterFile, generateReadme };
