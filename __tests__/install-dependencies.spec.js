import { spawn } from 'child_process';
import { installDependencies } from '../src/components/install-dependencies.js';
import config from '../__mocks__/config.mock.json';
import dependencies from '../__mocks__/dependencies.json';
import { CONSTANTS } from '../src/constants.js';

jest.mock('child_process');

const emptyDependencies = {
  prod: [],
  dev: [],
  peer: [],
};

const mockSpawn = (command, args, options) => {
  const forcedReturnCode = +args.includes('fail');
  const iterator = {
    async *[Symbol.asyncIterator]() {
      yield true;
      yield true;
    },
  };
  const on = (evt, listener) => {
    if (typeof listener === 'function') {
      listener.call(null, forcedReturnCode);
    }
  };

  return { stdout: iterator, stderr: iterator, on };
};

describe('Install Dependencies', () => {
  beforeEach(() => {
    spawn.mockImplementation(mockSpawn);

    config.msg = () => {};
    config.fileList = () => {};
  });

  it('should call `npm i` with default flags', async () => {
    const output = await installDependencies(config, dependencies);
    const { base } = dependencies;

    expect(spawn).toHaveBeenNthCalledWith(
      1,
      'npm',
      ['i', '', ...base.prod],
      expect.anything()
    );
    expect(spawn).toHaveBeenNthCalledWith(
      2,
      'npm',
      ['i', '--save-dev', ...base.dev],
      expect.anything()
    );
    expect(spawn).toHaveBeenNthCalledWith(
      3,
      'npm',
      ['i', '--save-peer', ...base.peer],
      expect.anything()
    );
  });

  it('should call `npm i` with both site and react dependencies', async () => {
    config.isReact = true;
    config.isModule = false;

    const output = await installDependencies(config, dependencies);
    const { base } = dependencies;

    expect(spawn).toHaveBeenNthCalledWith(
      1,
      'npm',
      ['i', '', ...base.prod],
      expect.anything()
    );
    expect(spawn).toHaveBeenNthCalledWith(
      2,
      'npm',
      ['i', '--save-dev', ...base.dev],
      expect.anything()
    );
    expect(spawn).toHaveBeenNthCalledWith(
      3,
      'npm',
      ['i', '--save-peer', ...base.peer],
      expect.anything()
    );
  });

  it('should bypass a dependency type if the arrays are empty', async () => {
    dependencies.base.dev = [];
    dependencies.react.dev = [];
    dependencies.site.dev = [];

    const { success } = CONSTANTS.installDependencies;
    const expected = `${success('Dependencies')}\n${success(
      'Peer Dependencies'
    )}`;
    const output = await installDependencies(config, dependencies);

    expect(output).toEqual(expected);
  });

  it('should throw installation errors if a package cannot install', async () => {
    dependencies.base = {
      ...emptyDependencies,
      ...{ prod: ['fail'] },
    };
    dependencies.react = { ...emptyDependencies };
    dependencies.site = { ...emptyDependencies };

    const expectedOutput = CONSTANTS.installDependencies.fail('Dependencies');
    const output = await installDependencies(config, dependencies);

    expect(output).toEqual(expectedOutput);
  });
});
