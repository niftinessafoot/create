import { jest } from '@jest/globals';
import { CONSTANTS } from '../src/constants';

jest.unstable_mockModule('fs', () => {
  return import('../__mocks__/fs');
});

const fs = await import('fs');
const { generateConfig } = await import('../src/components/generate-config');
const { generateDirectories } = await import(
  '../src/components/generate-directories.js'
);

describe('Generate Directories', () => {
  let settings = {};
  const generateExpectedOutput = (dirs) => {
    const opts = { recursive: true };

    return dirs.map((dir) => [dir, opts]);
  };

  beforeEach(() => {
    settings = {
      directories: ['foo', 'bar'],
      reactDirectories: ['reactOne', 'reactTwo'],
      siteDirectories: ['siteOne', 'siteTwo'],
      isReact: false,
      type: 'module',
    };
  });

  it('should generate base directories', () => {
    generateDirectories(settings);

    const mockCalls = fs.mkdirSync.mock.calls;
    const expectedOutput = generateExpectedOutput(settings.directories);

    expect(mockCalls).toEqual(expectedOutput);
  });

  it('should generate react directories', () => {
    settings.isReact = true;
    generateDirectories(settings);

    const mockCalls = fs.mkdirSync.mock.calls;
    const expectedOutput = generateExpectedOutput([
      ...settings.directories,
      ...settings.reactDirectories,
    ]);

    expect(mockCalls).toEqual(expectedOutput);
  });

  it('should generate site directories', () => {
    settings.type = 'site';
    generateDirectories(settings);

    const mockCalls = fs.mkdirSync.mock.calls;
    const expectedOutput = generateExpectedOutput([
      ...settings.directories,
      ...settings.siteDirectories,
    ]);

    expect(mockCalls).toEqual(expectedOutput);
  });

  it('should generate site and react directories', () => {
    settings.isReact = true;
    settings.type = 'site';
    generateDirectories(settings);

    const mockCalls = fs.mkdirSync.mock.calls;
    const expectedOutput = generateExpectedOutput([
      ...settings.directories,
      ...settings.siteDirectories,
      ...settings.reactDirectories,
    ]);

    expect(mockCalls).toEqual(expectedOutput);
  });
});
