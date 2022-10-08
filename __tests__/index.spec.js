const {
  installDependencies,
} = require('../components/install-dependencies.js');
const config = require('../__mocks__/config.mock.json');
const dependencies = require('../__mocks__/dependencies.mock.json');

describe('Install Dependencies', () => {
  it('should be true', async () => {
    const output = await installDependencies(config, dependencies);
    console.log(output);

    expect(true).toBeTruthy();
  });
});
