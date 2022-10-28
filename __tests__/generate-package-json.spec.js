import { writeFileSync, readFileSync, access, existsSync } from 'fs';
import { hasUncaughtExceptionCaptureCallback } from 'process';
import { generatePackageJson } from '../src/components/generate-package-json.js';

jest.mock('fs');

describe('Generate `package.json`', () => {
  let settings;

  beforeEach(() => {
    settings = {
      name: 'Matthew',
      entry: 'index.js',
      keywords: [],
      type: 'module',
      scripts: { build: 'foo', test: 'bar' },
      formatError: jest.fn((data) => data),
      msg: jest.fn((data) => data),
      fileList: jest.fn((data) => data),
    };
  });

  it('should generate a new package.json if one doesn’t exist', () => {
    const expected = {
      name: 'Matthew',
      entry: 'index.js',
      keywords: ['module'],
      scripts: { build: 'foo', test: 'bar' },
    };

    const output = generatePackageJson(settings);

    const calls = writeFileSync.mock.calls;
    const json = JSON.parse(calls[0][1]);

    expect(json).toEqual(expected);
  });

  it('should generate a new package.json with site options', () => {
    settings.type = 'site';

    const expected = {
      name: 'Matthew',
      entry: 'index.js',
      keywords: [],
      scripts: { build: 'foo', test: 'bar' },
    };

    const output = generatePackageJson(settings);

    const calls = writeFileSync.mock.calls;
    const json = JSON.parse(calls[0][1]);

    expect(json).toEqual(expected);
  });

  it('should generate a new package.json with react options', () => {
    settings.entry = 'index.tsx';
    settings.type = 'site';
    settings.isReact = true;

    const expected = {
      name: 'Matthew',
      entry: 'index.tsx',
      keywords: ['react'],
      scripts: { build: 'foo', test: 'bar' },
    };

    const output = generatePackageJson(settings);

    const calls = writeFileSync.mock.calls;
    const json = JSON.parse(calls[0][1]);

    expect(json).toEqual(expected);
  });

  describe('Existing `package.json`:', () => {
    //TODO: This test fails when running standalone, but passes when run with others in scope. Why?
    beforeEach(() => {
      existsSync.mockReturnValue(true);
    });

    it('should integrate existing configs', () => {
      readFileSync.mockReturnValue(JSON.stringify({ name: 'Steve' }));
      const expected = {
        name: 'Steve',
        keywords: ['module'],
        entry: 'index.js',
        scripts: { build: 'foo', test: 'bar' },
      };

      const output = generatePackageJson(settings);

      const calls = writeFileSync.mock.calls;
      const json = JSON.parse(calls[0][1]);

      expect(output).toEqual(
        '✅  `package.json` updated with missing default fields.'
      );

      expect(json).toEqual(expected);
    });

    it('should report if there are no missing configs', () => {
      const existing = {
        name: 'Steve',
        entry: 'index.js',
        keywords: [],
        scripts: { build: 'foo', test: 'bar' },
        author: '',
        description: '',
        license: '',
        version: 0,
      };

      const expected = {
        name: 'Steve',
        keywords: [],
        entry: 'index.js',
        scripts: { build: 'foo', test: 'bar' },
        author: '',
        description: '',
        license: '',
        version: 0,
      };
      readFileSync.mockReturnValue(JSON.stringify(existing));

      const output = generatePackageJson(settings);

      const calls = writeFileSync.mock.calls;
      const json = JSON.parse(calls[0][1]);

      expect(settings.msg).toHaveBeenCalledTimes(2);
      expect(output).toEqual(
        '✅  `package.json` complete. No fields to merge.'
      );
      expect(json).toEqual(expected);
    });
  });

  it('should pass errors if writing the json fails', () => {
    writeFileSync.mockImplementation((...args) => {
      args[2].call(null, 'Error');
    });

    const expected = {
      name: 'Matthew',
      keywords: ['module'],
      entry: 'index.js',
      scripts: { build: 'foo', test: 'bar' },
    };

    const output = generatePackageJson(settings);

    expect(output).toEqual('Error');
  });
});
