import { spawn } from 'cross-spawn'; // For longer-running, data-intense jobs.
import { CONSTANTS } from '../constants.js';
//TODO: Pull problem package name to highlight.

async function installDependencies(config, dependencies) {
  const { isReact, isModule, msg, fileList } = config;
  const { base, react, site } = dependencies;

  const dependencyMap = {
    prod: { category: 'Dependencies', modifier: '' },
    dev: { category: 'Dev Dependencies', modifier: '--save-dev' },
    peer: { category: 'Peer Dependencies', modifier: '--save-peer' },
  };
  const keys = Object.keys(base);

  const mergedDependencies = keys.map((category) => {
    if (isReact) {
      base[category].push(...react[category]);
    }

    if (!isModule) {
      base[category].push(...site[category]);
    }

    return base[category];
  });

  const promises = mergedDependencies
    .filter((dependencyList, index) => {
      const len = dependencyList.length;
      if (!len) {
        keys.splice(index, 1);
      }
      return len;
    })
    .map(async (dependencyList, index, source) => {
      const formattedList = dependencyList.join(' ');
      const { modifier, category } = dependencyMap[keys[index]];

      msg(
        CONSTANTS.installDependencies.installList(
          modifier,
          fileList(dependencyList)
        )
      );

      const output = spawn('npm', ['i', modifier, ...dependencyList], {
        cwd: process.cwd(),
      });

      let info = `${formattedList}\n`;
      let err = '';

      for await (const data of output.stderr) {
        if (!err) {
          err = CONSTANTS.installDependencies.error(formattedList);
        }

        err += data;
      }

      for await (const data of output.stdout) {
        info += data;
      }

      const exitCode = await new Promise((resolve) => {
        output.on('close', resolve);
      });

      promises.push(exitCode);

      if (exitCode) {
        msg(err, 'err');
        return CONSTANTS.installDependencies.fail(category);
      }

      return CONSTANTS.installDependencies.success(category);
    });

  return Promise.all(promises).then((...args) => {
    return args.map((iteration) => iteration.join('\n')).join('\n');
  });
}

export { installDependencies };
