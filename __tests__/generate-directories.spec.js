import { mkdirSync } from 'fs';
import { generateDirectories } from '../src/components/generate-directories.js';

jest.mock('fs');

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

    const mockCalls = mkdirSync.mock.calls;
    const expectedOutput = generateExpectedOutput(settings.directories);

    expect(mockCalls).toEqual(expectedOutput);
  });

  it('should generate react directories', () => {
    settings.isReact = true;
    generateDirectories(settings);

    const mockCalls = mkdirSync.mock.calls;
    const expectedOutput = generateExpectedOutput([
      ...settings.directories,
      ...settings.reactDirectories,
    ]);

    expect(mockCalls).toEqual(expectedOutput);
  });

  it('should generate site directories', () => {
    settings.type = 'site';
    generateDirectories(settings);

    const mockCalls = mkdirSync.mock.calls;
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

    const mockCalls = mkdirSync.mock.calls;
    const expectedOutput = generateExpectedOutput([
      ...settings.directories,
      ...settings.siteDirectories,
      ...settings.reactDirectories,
    ]);

    expect(mockCalls).toEqual(expectedOutput);
  });
});
