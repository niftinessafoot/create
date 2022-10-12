function _copyFilesFilter(src, dest) {
  return true;
}

function copyFiles(config) {
  fs.copy(`${__dirname}/../files`, './', errorCallback);
}
export { copyFiles };
