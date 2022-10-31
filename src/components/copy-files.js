import { readdirSync, copyFileSync, writeFileSync, constants } from 'fs';
import { format } from 'prettier';
import { CONSTANTS } from '../constants.js';

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
    writeFileSync('./README.md', formattedContent, { flag: 'w' });
    message = CONSTANTS.generateReadme.success;
  } catch (err) {
    message = formatWarning(CONSTANTS.generateReadme.fail);
  }

  return message;
}

function copyFiles(config) {
  const { __dirname, msg, fileList, isModule, isTypescript } = config;
  const filePath = `${__dirname}/../files/`;
  const files = readdirSync(filePath);
  const copiedFiles = [];
  const moduleDisallow = ['webpack.config.js', 'webpack.template.html'];
  const siteDisallow = ['rollup.config.js'];
  const tsDisallow = ['tsconfig.json'];

  const pruneArray = (files, disallow) => {
    disallow.forEach((file) => {
      const index = files.indexOf(file);
      if (index > -1) {
        files.splice(index, 1);
      }
    });
  };

  if (isModule) {
    pruneArray(files, moduleDisallow);
  } else {
    pruneArray(files, siteDisallow);
  }

  if (!isTypescript) {
    pruneArray(files, tsDisallow);
  }

  Array.isArray(files) &&
    files.forEach((file) => {
      const origin = filePath + file;
      const destination = `./${file}`;
      try {
        copyFileSync(origin, destination, constants.COPYFILE_EXCL);
        copiedFiles.push(file);
      } catch (err) {
        msg(CONSTANTS.copyFiles.failCopy(file), 'warn');
        const errorFileArray = file.split('.');
        errorFileArray.splice(-1, 0, `DEFAULT`);
        const duplicateFile = `./${errorFileArray.join('.')}`;
        try {
          copyFileSync(origin, duplicateFile, constants.COPYFILE_EXCL);
        } catch (err) {
          msg(CONSTANTS.copyFiles.failDuplicate(duplicateFile), 'err');
        }
      }
    });

  const message = CONSTANTS.copyFiles.outputSuccess;
  const emptyMessage = CONSTANTS.copyFiles.outputFail;

  return copiedFiles.length
    ? `${message}\n${fileList(copiedFiles)}`
    : emptyMessage;
}
export { copyFiles, writeStarterFile, generateReadme };
