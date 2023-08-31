import { generateConfig } from '../src/components/generate-config.js';

const config = {
  name: 'defaultName',
  src: 'defaultSrc',
  dist: 'defaultDist',
  entry: 'defaultEntry',
  isModule: true,
};

describe('Generate Config', () => {
  beforeEach(() => {
    process.argv = ['node', 'script'];
  });

  it('should return a default settings object', () => {
    const settings = generateConfig(config);

    expect(settings).toEqual(config);
  });

  it('should return a configured settings object', () => {
    process.argv.push(
      '-t',
      'site',
      '-n',
      'projectName',
      '-s',
      'userSrc',
      '-d',
      'userDist',
      '-e',
      'userEntry'
    );
    const expectedOutput = {
      name: 'projectName',
      src: 'userSrc',
      dist: 'userDist',
      entry: 'userEntry',
      isModule: false,
      isReact: false,
      isTypescript: false,
    };
    const settings = generateConfig(config);

    expect(settings).toEqual(expectedOutput);
  });
});
