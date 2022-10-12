import { installDependencies } from '../src/components/install-dependencies.js';
import config from '../__mocks__/config.mock.json';
import dependencies from '../__mocks__/dependencies.mock.json';
import { spawn } from 'child_process';

jest.mock('child_process');

describe('Install Dependencies', () => {
  it('should call `npm i` with base dependencies', async () => {
    const output = await installDependencies(config, dependencies);
    const { base } = dependencies;

    expect(spawn).toHaveBeenCalledWith(
      'npm',
      ['i', '-D', 'react'],
      expect.anything()
    );
  });

  /*  it('should install react dependencies when react configured', async () => {
    config.isReact = true;
    const output = await installDependencies(config, dependencies);
    console.log(output);

    expect(true).toBeTruthy();
  });
  */
});
