import { readdirSync, copyFileSync, constants } from 'fs';

function copyFiles(config) {
  const { __dirname, msg } = config;
  const filePath = `${__dirname}/../files/`;
  const files = readdirSync(filePath);
  const copiedFiles = [];

  Array.isArray(files) &&
    files.forEach((file) => {
      try {
        copyFileSync(filePath + file, `./${file}`, constants.COPYFILE_EXCL);
        copiedFiles.push(file);
      } catch (err) {
        msg(`${file} already exists. Will not overwrite.`, 'warn');
      }
    });

  const prefix = '\n  • ';
  return copiedFiles.length ? prefix + copiedFiles.join(prefix) : '';
}
export { copyFiles };
