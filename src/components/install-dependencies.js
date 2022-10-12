import { spawn } from 'cross-spawn'; // For longer-running, data-intense jobs.

async function installDependencies(config, dependencies) {
  const { isReact, isModule } = config;
  const { base, react, site } = dependencies;
  let info = '';
  let err = '';

  let dependencyModifier;
  // switch()

  const keys = Object.keys(base);
  keys.map((type) => {
    if (isReact) {
      base[type].push(...react[type]);
    }
    if (!isModule) {
      base[type].push(...site[type]);
    }
  });

  // Use new Set(array) to force uniques.

  const output = spawn('npm', ['i', '-D', base], {
    cwd: process.cwd(),
  });

  for await (const data of output.stderr) {
    err += data;
  }

  for await (const data of output.stdout) {
    info += data;
  }

  const exitCode = await new Promise((resolve) => {
    output.on('close', resolve);
  });

  if (exitCode) {
    error(bold(formatError('Installation Errors')));
    log();
    error(red(err));
    process.exit(exitCode);
  }

  return info;
}

export { installDependencies };
