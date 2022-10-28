import { copyFileSync, readdirSync } from 'fs';
import { copyFiles } from '../src/components/copy-files.js';

jest.mock('fs');

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
    const fileName = 'foo.txt';
    const fileLocation = `/../files/${fileName}`;
    const expectedFileNames = [`./foo.txt`, './foo.DEFAULT.txt'];

    readdirSync.mockReturnValue([fileName]);
    copyFileSync.mockImplementationOnce(() => {
      throw new Error();
    });
    const output = copyFiles(config);

    expect(output).toEqual('✅  No new files copied.');
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
      `\`${fileName}\` already exists. Generating backup.`,
      'warn'
    );
  });

  it('should not generate anything if the backup already exists', () => {
    const msgSpy = jest.spyOn(config, 'msg');
    const fileName = 'foo.txt';
    const fileLocation = `/../files/${fileName}`;
    const expectedFileNames = [`./foo.txt`, './foo.DEFAULT.txt'];

    readdirSync.mockReturnValue([fileName]);
    copyFileSync.mockImplementation(() => {
      throw new Error();
    });
    const output = copyFiles(config);

    expect(output).toEqual('✅  No new files copied.');
    expect(msgSpy).toHaveBeenCalledWith(
      `\`${expectedFileNames[1]}\` already exists. No new file copied.`,
      'warn'
    );
  });
});
