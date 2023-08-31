import { jest } from '@jest/globals';
import { CONSTANTS } from '../src/constants';
import {
  expectedModuleJson,
  expectedSiteJson,
  expectedModuleReactJson,
  expectedModuleTypescriptJson,
} from '../__mocks__/expected-output';

jest.unstable_mockModule('fs', () => {
  return import('../__mocks__/fs');
});

const fs = await import('fs');
const { generateConfig } = await import('../src/components/generate-config');
const { generatePackageJson } = await import(
  '../src/components/generate-package-json'
);

const internals = {
  formatError: jest.fn((data) => {
    return data;
  }),
  msg: jest.fn((data) => data),
  fileList: jest.fn((data) => data),
};

describe('Generate `package.json`', () => {
  let baseConfig;
  let configModule;
  let configSite;

  beforeEach(() => {
    baseConfig = {
      src: './src',
      dist: './dist',
      entry: 'index.js',
      scope: '@afoot',
      isModule: true,
      directories: ['__tests__', 'src'],
      siteDirectories: ['functions', 'src/js', 'src/styles', 'src/pages'],
      reactDirectories: ['src/components'],
    };

    configModule = {
      name: 'test-module',
      ...baseConfig,
      ...internals,
    };

    configSite = {
      name: 'test-site',
      ...baseConfig,
      ...internals,
    };
  });

  it('should generate a new, default package.json if one doesn’t exist', async () => {
    const settings = await generateConfig(configModule);

    await generatePackageJson(settings);

    const calls = fs.writeFileSync.mock.calls;
    const json = JSON.parse(calls[0][1]);

    expect(json).toEqual(expectedModuleJson);
  });

  it('should generate a default package name', async () => {
    const settings = await generateConfig(configModule);
    delete settings.name;

    await generatePackageJson(settings);

    const calls = fs.writeFileSync.mock.calls;
    const json = JSON.parse(calls[0][1]);

    const output = { ...expectedModuleJson };

    output.name = '@afoot/module';
    output.homepage = 'https://github.com/niftinessafoot/module';
    output.bugs = 'https://github.com/niftinessafoot/module';
    output.repository = {
      type: 'git',
      url: 'https://github.com/niftinessafoot/module',
    };

    expect(json).toEqual(output);
  });

  it('should generate a new package.json with site options', async () => {
    const settings = await generateConfig(configSite);
    // Jest assigns process.argv.t to the test title in generate-config.js
    // isModule always returns true in jest.
    settings.isModule = false;

    await generatePackageJson(configSite);

    const calls = fs.writeFileSync.mock.calls;
    const json = JSON.parse(calls[0][1]);

    expect(json).toEqual(expectedSiteJson);
  });

  it('should generate non-module configs', async () => {
    const settings = await generateConfig(configSite);
    settings.isModule = false;

    await generatePackageJson(settings);

    const calls = fs.writeFileSync.mock.calls;
    const json = JSON.parse(calls[0][1]);

    const output = { ...expectedSiteJson };
    output.keywords = [];
    delete output.exports;

    expect(json).toEqual(output);
  });

  it('should generate a new package.json with react options', async () => {
    configModule.entry = 'index.jsx';
    const settings = generateConfig(configModule);

    await generatePackageJson(settings);

    const calls = fs.writeFileSync.mock.calls;
    const json = JSON.parse(calls[0][1]);

    expect(json).toEqual(expectedModuleReactJson);
  });

  it('should generate a new package.json with additional scripts', async () => {
    configModule.entry = 'index.jsx';
    configModule.scripts = {
      build: 'foo',
      test: 'bar',
      clean: 'buzz',
      'test:coverage': 'squeaky',
    };
    const settings = generateConfig(configModule);

    await generatePackageJson(settings);

    const calls = fs.writeFileSync.mock.calls;
    const json = JSON.parse(calls[0][1]);

    const { scripts: testScripts } = expectedModuleReactJson;

    expectedModuleReactJson.scripts = {
      ...testScripts,
      ...configModule.scripts,
    };

    expect(json).toEqual(expectedModuleReactJson);
  });

  it('should generate a new package.json with TypeScript options', async () => {
    configModule.entry = 'index.ts';
    const settings = generateConfig(configModule);

    await generatePackageJson(settings);

    const calls = fs.writeFileSync.mock.calls;
    const json = JSON.parse(calls[0][1]);

    expect(json).toEqual(expectedModuleTypescriptJson);
  });

  describe('Existing `package.json`:', () => {
    const name = 'existing-package';

    //TODO: This test block fails when running standalone, but passes when run with others in scope. Why?
    beforeEach(() => {
      fs.existsSync.mockReturnValue(true);
    });

    it('should integrate existing configs', () => {
      fs.readFileSync.mockReturnValue(JSON.stringify({ name }));
      expectedModuleJson.name = name;

      const settings = generateConfig(configModule);
      const output = generatePackageJson(settings);

      const calls = fs.writeFileSync.mock.calls;
      const json = JSON.parse(calls[0][1]);

      expect(settings.msg).toHaveBeenCalledTimes(4);
      expect(output).toEqual(CONSTANTS.generatePackageJson.completeMerged);
      expect(json).toEqual(expectedModuleJson);
    });

    it('should report if there are no missing configs', () => {
      fs.readFileSync.mockReturnValue(JSON.stringify(expectedModuleJson));

      const settings = generateConfig(configModule);
      const output = generatePackageJson(settings);

      const calls = fs.writeFileSync.mock.calls;
      const json = JSON.parse(calls[0][1]);

      expect(internals.msg).toHaveBeenCalledTimes(2);
      expect(output).toEqual(CONSTANTS.generatePackageJson.completeExisting);
      expect(json).toEqual(expectedModuleJson);
    });
  });

  it('should pass errors if writing the json fails', async () => {
    fs.writeFileSync.mockImplementation((...args) => {
      throw 'Error';
    });

    const output = await generatePackageJson(configModule);

    expect(output).toEqual('Error');
  });
});
