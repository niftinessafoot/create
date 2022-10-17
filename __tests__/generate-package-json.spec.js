import { writeFileSync, readFileSync, access, existsSync } from 'fs';
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

  it('should integrate existing configs if package.json exists', () => {
    existsSync.mockReturnValue(true);
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

    expect(json).toEqual(expected);
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
