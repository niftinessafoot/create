import minimist from 'minimist';

const _getIsReact = (filename) => {
  const reg = /(j|t)sx/;
  const str = filename?.split('.').pop();
  return reg.test(str);
};

const _getIsTypescript = (filename) => {
  const reg = /tsx?/;
  const str = filename?.split('.').pop();
  return reg.test(str);
};

const _getIsModule = (type) => {
  return type !== 'site';
};

/**
 *
 * @param {Object} config Default config object.
 * @returns {Object} Modified config object.
 */
function generateConfig(config) {
  const args = minimist(process.argv.slice(2));
  const overrides = {};

  const keyMap = {
    name: ['n', 'name'],
    dist: ['d', 'dist'],
    src: ['s', 'src'],
    entry: ['e', 'entry'],
    isModule: ['t', 'type', (value) => _getIsModule(value)],
  };

  Object.keys(keyMap).forEach((key, index) => {
    const [short, long, transformer] = keyMap[key];
    const value = args[short] || args[long];
    const hasTransformer = typeof transformer === 'function';

    if (value) {
      const output = hasTransformer ? transformer.call(null, value) : value;

      overrides[key] = output;
    }
  });

  const output = Object.assign(config, overrides);

  output['isReact'] = _getIsReact(output.entry);
  output['isTypescript'] = _getIsTypescript(output.entry);

  return output;
}

export { generateConfig };
