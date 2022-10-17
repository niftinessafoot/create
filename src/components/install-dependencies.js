import { spawn } from 'cross-spawn'; // For longer-running, data-intense jobs.
//TODO: Pull problem package name to highlight.

async function installDependencies(config, dependencies) {
  const { isReact, isModule, msg, fileList } = config;
  const { base, react, site } = dependencies;

  const dependencyMap = {
    prod: { name: 'Dependencies', modifier: '' },
    dev: { name: 'Dev Dependencies', modifier: '--save-dev' },
    peer: { name: 'Peer Dependencies', modifier: '--save-peer' },
  };
  const keys = Object.keys(base);

  const mergedDependencies = keys.map((type) => {
    if (isReact) {
      base[type].push(...react[type]);
    }

    if (!isModule) {
      base[type].push(...site[type]);
    }

    return base[type];
  });

  const promises = mergedDependencies
    .filter((arr, index) => {
      const len = arr.length;
      if (!len) {
        keys.splice(index, 1);
      }
      return len;
    })
    .map(async (arr, index, source) => {
      const str = arr.join(' ');
      const { modifier, name } = dependencyMap[keys[index]];

      msg(`Installing ${name}\n${fileList(arr)}\n`);

      const output = spawn('npm', ['i', modifier, ...arr], {
        cwd: process.cwd(),
      });

      let info = `${str}\n`;
      let err = '';

      for await (const data of output.stderr) {
        if (!err) {
          err = `Installation Errors\n\nCould not install: ${str}\n\n`;
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
        return `⚠️ Issues with ${name} Installation`;
      }

      return `${name} Complete`;
    });

  return Promise.all(promises).then((...args) => {
    return args.map((iteration) => iteration.join('\n')).join('\n');
  });
}

export { installDependencies };
