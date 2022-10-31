import { copyFileSync, writeFileSync, readdirSync } from 'fs';
import { copyFiles, writeStarterFile } from '../src/components/copy-files.js';
import { CONSTANTS } from '../src/constants.js';
import { format } from 'prettier';

jest.mock('fs');
jest.mock('prettier');

describe('Copy Files', () => {
  let config = {};

  beforeEach(() => {
    config = {
      __dirname: '',
      msg: jest.fn((str, code) => false),
      fileList: jest.fn((data) => data),
    };
  });

  it('should copy files when it does not exist in the destination', () => {
    readdirSync.mockReturnValue(['foo']);

    const output = copyFiles(config);

    expect(copyFileSync).toHaveBeenCalledWith('/../files/foo', './foo', 1);
  });

  it('should generate backup files if copied file already exists', () => {
    const msgSpy = jest.spyOn(config, 'msg');
    const files = ['foo.txt'];
    const fileLocation = `/../files/${files[0]}`;
    const expectedFileNames = [`./foo.txt`, './foo.DEFAULT.txt'];

    readdirSync.mockReturnValue(files);
    copyFileSync.mockImplementationOnce(() => {
      throw new Error();
    });
    const output = copyFiles(config);

    expect(output).toEqual(CONSTANTS.copyFiles.outputFail);
    expect(copyFileSync).nthCalledWith(
      1,
      fileLocation,
      expectedFileNames[0],
      1
    );
    expect(copyFileSync).nthCalledWith(
      2,
      fileLocation,
      expectedFileNames[1],
      1
    );

    expect(msgSpy).toHaveBeenCalledWith(
      CONSTANTS.copyFiles.failCopy(files[0]),
      'warn'
    );
  });

  it('should not generate anything if the backup already exists', () => {
    const msgSpy = jest.spyOn(config, 'msg');
    const files = ['foo.txt'];
    const expected = './foo.DEFAULT.txt';

    readdirSync.mockReturnValue(files);
    copyFileSync.mockImplementation(() => {
      throw new Error();
    });
    const output = copyFiles(config);

    expect(output).toEqual(CONSTANTS.copyFiles.outputFail);
    expect(msgSpy).nthCalledWith(
      2,
      CONSTANTS.copyFiles.failDuplicate(expected),
      'err'
    );
  });

  describe('Prune files based on flags', () => {
    it('should omit site files when generating a module', () => {
      config.isModule = true;
      const msgSpy = jest.spyOn(config, 'msg');
      const files = ['foo.txt', 'webpack.config.js', 'rollup.config.js'];
      const expected = ['./foo.txt', './rollup.config.js'];

      readdirSync.mockReturnValue(files);

      const output = copyFiles(config);
      const callArray = copyFileSync.mock.calls.map((arr) => arr[1]);

      expect(callArray).toEqual(expect.arrayContaining(expected));
    });

    it('should omit module files when generating a site', () => {
      config.isModule = false;
      const msgSpy = jest.spyOn(config, 'msg');
      const files = ['foo.txt', 'webpack.config.js', 'rollup.config.js'];
      const expected = ['./foo.txt', './webpack.config.js'];

      readdirSync.mockReturnValue(files);

      const output = copyFiles(config);
      const callArray = copyFileSync.mock.calls.map((arr) => arr[1]);

      expect(callArray).toEqual(expect.arrayContaining(expected));
    });
    it('should omit typescript files when generating non-ts files', () => {
      config.isTypescript = false;
      const msgSpy = jest.spyOn(config, 'msg');
      const files = ['foo.txt', 'tsconfig.json'];
      const expected = ['./foo.txt'];

      readdirSync.mockReturnValue(files);

      const output = copyFiles(config);
      const callArray = copyFileSync.mock.calls.map((arr) => arr[1]);

      expect(callArray).toEqual(expect.arrayContaining(expected));
    });
  });
});

describe('Write Starter File', () => {
  let config = {};

  beforeEach(() => {
    config = {
      __dirname: '',
      msg: jest.fn((str, code) => false),
      fileList: jest.fn((data) => data),
      formatWarning: jest.fn((data) => data),
      src: 'src',
      entry: 'index.js',
    };
  });

  it('should generate base entry file', () => {
    format.mockImplementation((data) => data);

    const { src, entry } = config;
    const filePath = `./${src}/${entry}`;
    const output = writeStarterFile(config);
    const calls = writeFileSync.mock.calls[0];

    expect(calls).toEqual([
      filePath,
      CONSTANTS.writeStarterFile.baseFunction(),
      { flag: 'wx' },
    ]);
    expect(output).toEqual(CONSTANTS.writeStarterFile.msg.success(filePath));
  });

  it('should generate a react entry file', () => {
    format.mockImplementation((data) => data);
    config.entry = 'index.jsx';
    config.isReact = true;
    config.isModule = true;

    const { src, entry } = config;
    const filePath = `./${src}/${entry}`;
    const output = writeStarterFile(config);
    const calls = writeFileSync.mock.calls[0];

    expect(calls).toEqual([
      filePath,
      CONSTANTS.writeStarterFile.reactFunction(),
      { flag: 'wx' },
    ]);
    expect(output).toEqual(CONSTANTS.writeStarterFile.msg.success(filePath));
  });

  it('should generate a typescript entry file', () => {
    format.mockImplementation((data) => data);
    config.entry = 'index.ts';
    config.isTypescript = true;

    const { src, entry } = config;
    const filePath = `./${src}/${entry}`;
    const output = writeStarterFile(config);
    const calls = writeFileSync.mock.calls[0];

    expect(calls).toEqual([
      filePath,
      CONSTANTS.writeStarterFile.baseFunction(':boolean'),
      { flag: 'wx' },
    ]);
    expect(output).toEqual(CONSTANTS.writeStarterFile.msg.success(filePath));
  });

  it('should generate a react typescript entry file', () => {
    format.mockImplementation((data) => data);
    config.entry = 'index.tsx';
    config.isTypescript = true;
    config.isReact = true;
    config.isModule = true;

    const { src, entry } = config;
    const filePath = `./${src}/${entry}`;
    const output = writeStarterFile(config);
    const calls = writeFileSync.mock.calls[0];

    expect(calls).toEqual([
      filePath,
      CONSTANTS.writeStarterFile.reactFunction(': ReactElement'),
      { flag: 'wx' },
    ]);
    expect(output).toEqual(CONSTANTS.writeStarterFile.msg.success(filePath));
  });

  it('should not overwrite existing entry files', () => {
    const { src, entry } = config;
    const filePath = `./${src}/${entry}`;

    writeFileSync.mockImplementation(() => {
      throw new Error();
    });

    const output = writeStarterFile(config);

    expect(output).toEqual(CONSTANTS.writeStarterFile.msg.fail(filePath));
  });
});
