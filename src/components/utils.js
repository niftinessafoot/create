import chalk from 'chalk';
const { red } = chalk;
const errorFormat = (err) => `🚨 ${red(err)}`;
const errorCallback = (err) => err && console.error(errorFormat(err));

export { errorFormat, errorCallback };
