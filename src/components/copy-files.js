import { readdirSync, copyFileSync, writeFileSync, constants } from 'fs';

function writeFiles(config) {
  const { src, entry, isReact, msg } = config;
  const filePath = `./${src}/${entry}`;
  console.log(filePath);
  try {
    //TODO: Change default output based on TypesScript and React
    //TODO: TEsts for this funcion
    writeFileSync(filePath, 'export default ()=>{};', { flag: 'wx' });
  } catch (err) {
    msg('exists', 'err');
  }
}

function copyFiles(config) {
  const { __dirname, msg, fileList } = config;
  //TODO: Copy flag-specific files e.g. webpack.config
  const filePath = `${__dirname}/../files/`;
  const files = readdirSync(filePath);
  const copiedFiles = [];

  Array.isArray(files) &&
    files.forEach((file) => {
      const fileLocation = `./${file}`;
      const origin = filePath + file;
      try {
        copyFileSync(origin, fileLocation, constants.COPYFILE_EXCL);
        copiedFiles.push(file);
      } catch (err) {
        msg(`\`${file}\` already exists. Generating backup.`, 'warn');
        const errorFileArray = file.split('.');
        errorFileArray.splice(-1, 0, `DEFAULT`);
        const errorFile = `./${errorFileArray.join('.')}`;
        try {
          copyFileSync(origin, errorFile, constants.COPYFILE_EXCL);
        } catch (err) {
          msg(`\`${errorFile}\` already exists. No new file copied.`, 'err');
        }
      }
    });

  const message = '✅  The following files have been copied over:';
  const emptyMessage = '✅  No new files copied.';

  return copiedFiles.length
    ? `${message}\n${fileList(copiedFiles)}`
    : emptyMessage;
}
export { copyFiles, writeFiles };
