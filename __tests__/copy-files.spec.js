import { copyFileSync, writeFileSync, readdirSync } from 'fs';
import { copyFiles, writeFiles } from '../src/components/copy-files.js';
import CONTSTANTS, { CONSTANTS } from '../src/constants.js';
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
});

describe('Write Files', () => {
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
    const output = writeFiles(config);
    const calls = writeFileSync.mock.calls[0];

    expect(calls).toEqual([
      filePath,
      CONSTANTS.writeFiles.baseFunction(),
      { flag: 'wx' },
    ]);
    expect(output).toEqual(CONSTANTS.writeFiles.msg.success(filePath));
  });

  it('should generate a react entry file', () => {
    format.mockImplementation((data) => data);
    config.entry = 'index.jsx';
    config.isReact = true;

    const { src, entry } = config;
    const filePath = `./${src}/${entry}`;
    const output = writeFiles(config);
    const calls = writeFileSync.mock.calls[0];

    expect(calls).toEqual([
      filePath,
      CONSTANTS.writeFiles.reactFunction(),
      { flag: 'wx' },
    ]);
    expect(output).toEqual(CONSTANTS.writeFiles.msg.success(filePath));
  });

  it('should generate a typescript entry file', () => {
    format.mockImplementation((data) => data);
    config.entry = 'index.ts';
    config.isTypescript = true;

    const { src, entry } = config;
    const filePath = `./${src}/${entry}`;
    const output = writeFiles(config);
    const calls = writeFileSync.mock.calls[0];

    expect(calls).toEqual([
      filePath,
      CONSTANTS.writeFiles.baseFunction(':boolean'),
      { flag: 'wx' },
    ]);
    expect(output).toEqual(CONSTANTS.writeFiles.msg.success(filePath));
  });

  it('should generate a react typescript entry file', () => {
    format.mockImplementation((data) => data);
    config.entry = 'index.tsx';
    config.isTypescript = true;
    config.isReact = true;

    const { src, entry } = config;
    const filePath = `./${src}/${entry}`;
    const output = writeFiles(config);
    const calls = writeFileSync.mock.calls[0];

    expect(calls).toEqual([
      filePath,
      CONSTANTS.writeFiles.reactFunction(':React.ReactElement'),
      { flag: 'wx' },
    ]);
    expect(output).toEqual(CONSTANTS.writeFiles.msg.success(filePath));
  });

  it('should not overwrite existing entry files', () => {
    const { src, entry } = config;
    const filePath = `./${src}/${entry}`;

    writeFileSync.mockImplementation(() => {
      throw new Error();
    });

    const output = writeFiles(config);

    expect(output).toEqual(CONSTANTS.writeFiles.msg.fail(filePath));
  });
});
