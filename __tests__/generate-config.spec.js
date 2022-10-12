import { generateConfig } from '../src/components/generate-config.js';

const config = {
  name: 'defaultName',
  src: 'defaultSrc',
  dist: 'defaultDist',
  entry: 'defaultEntry',
  type: 'module',
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
      'userName',
      '-s',
      'userSrc',
      '-d',
      'userDist',
      '-e',
      'userEntry'
    );
    const expectedOutput = {
      name: 'userName',
      src: 'userSrc',
      dist: 'userDist',
      entry: 'userEntry',
      type: 'site',
    };
    const settings = generateConfig(config);

    expect(settings).toEqual(expectedOutput);
  });

  it('should reject invalid types', () => {
    jest.spyOn(process, 'exit').mockImplementation((errorCode) => errorCode);
    process.argv.push('-t', 'failure');

    expect(() => {
      generateConfig(config);
    }).toThrow('Allowed choices are module, site.');
  });
});
