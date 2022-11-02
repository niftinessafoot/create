import { writeFileSync, readFileSync, existsSync } from 'fs';
import { generatePackageJson } from '../src/components/generate-package-json';
import { CONSTANTS } from '../src/constants';

jest.mock('fs');

describe('Generate `package.json`', () => {
  let settings;
  let scripts;
  let siteScripts;
  let basePackageJson;

  beforeEach(() => {
    scripts = {
      build: 'foo',
      test: 'bar',
      clean: 'buzz',
      'test:coverage': 'squeaky',
    };
    siteScripts = {
      dev: 'dev',
      start: 'start',
      'start:prod': 'start:prod',
    };
    basePackageJson = {
      name: 'Matthew',
      entry: 'index.js',
      keywords: [],
      type: 'module',
      scripts,
      browserslist: '',
      repository: '',
    };
    settings = {
      ...basePackageJson,
      src: 'src',
      dist: 'dist',
      isModule: true,
      isTypescript: false,
      formatError: jest.fn((data) => data),
      msg: jest.fn((data) => data),
      fileList: jest.fn((data) => data),
    };
  });

  it('should generate a new package.json if one doesn’t exist', () => {
    const output = generatePackageJson(settings);

    const calls = writeFileSync.mock.calls;
    const json = JSON.parse(calls[0][1]);

    expect(json).toEqual(basePackageJson);
  });

  it('should generate a new package.json with site options', () => {
    settings.type = 'site';
    settings.isModule = false;

    delete basePackageJson.type; //`type` is only for modules.
    Object.assign(basePackageJson.scripts, siteScripts);

    const output = generatePackageJson(settings);

    const calls = writeFileSync.mock.calls;
    const json = JSON.parse(calls[0][1]);

    expect(json).toEqual(basePackageJson);
  });

  it('should generate a new package.json with react options', () => {
    settings.entry = 'index.jsx';
    settings.isReact = true;

    basePackageJson.keywords = ['module', 'react'];
    basePackageJson.entry = 'index.jsx';

    const output = generatePackageJson(settings);

    const calls = writeFileSync.mock.calls;
    const json = JSON.parse(calls[0][1]);

    expect(json).toEqual(basePackageJson);
  });

  it('should generate a new package.json with TypeScript options', () => {
    settings.entry = 'index.tsx';
    settings.isTypescript = true;
    settings.dist = 'dist';

    basePackageJson.types = 'dist/types/index.d.ts';
    basePackageJson.entry = 'index.tsx';
    basePackageJson.scripts.types = 'tsc';
    basePackageJson.keywords.push('typescript');

    const output = generatePackageJson(settings);

    const calls = writeFileSync.mock.calls;
    const json = JSON.parse(calls[0][1]);

    expect(json).toEqual(basePackageJson);
  });

  describe('Existing `package.json`:', () => {
    //TODO: This test block fails when running standalone, but passes when run with others in scope. Why?
    beforeEach(() => {
      existsSync.mockReturnValue(true);
    });

    it('should integrate existing configs', () => {
      readFileSync.mockReturnValue(JSON.stringify({ name: 'Steve' }));
      basePackageJson.name = 'Steve';

      const output = generatePackageJson(settings);

      const calls = writeFileSync.mock.calls;
      const json = JSON.parse(calls[0][1]);

      expect(settings.msg).toHaveBeenCalledTimes(4);
      expect(output).toEqual(CONSTANTS.generatePackageJson.completeMerged);
      expect(json).toEqual(basePackageJson);
    });

    it('should report if there are no missing configs', () => {
      const existing = Object.assign(basePackageJson, {
        name: 'Dave',
        keywords: ['module'],
        author: '',
        description: '',
        files: '',
        license: '',
        version: '',
      });

      readFileSync.mockReturnValue(JSON.stringify(existing));

      const output = generatePackageJson(settings);

      const calls = writeFileSync.mock.calls;
      const json = JSON.parse(calls[0][1]);

      expect(settings.msg).toHaveBeenCalledTimes(2);
      expect(output).toEqual(CONSTANTS.generatePackageJson.completeExisting);
      expect(json).toEqual(basePackageJson);
    });
  });

  it('should pass errors if writing the json fails', () => {
    writeFileSync.mockImplementation((...args) => {
      args[2].call(null, 'Error');
    });

    const output = generatePackageJson(settings);

    expect(output).toEqual('Error');
  });
});
