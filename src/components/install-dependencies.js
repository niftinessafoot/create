async function installDependencies(config, dependencies) {
  const { isReact, isModule } = config;
  const { base, react, site } = dependencies;
  let info = '';
  let err = '';

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

  /*     const output = spawn('npm', ['i', '-D', ...dependencies], {
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

    return info; */

  return base;
}

export { installDependencies };
