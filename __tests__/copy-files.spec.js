import { copyFileSync, readdirSync } from 'fs';
import { copyFiles } from '../src/components/copy-files.js';

jest.mock('fs');

describe('Copy Files', () => {
  let config = {};

  beforeEach(() => {
    config = {
      __dirname: '',
      msg: (str, code) => false,
    };
  });

  it('should copy files when it does not exist in the destination', () => {
    readdirSync.mockReturnValue(['foo']);

    const output = copyFiles(config);

    expect(copyFileSync).toHaveBeenCalledWith('/../files/foo', './foo', 1);
  });

  it('should not copy files when they already exist', () => {
    const spy = jest.spyOn(config, 'msg');

    readdirSync.mockReturnValue(['foo']);
    copyFileSync.mockImplementation(() => {
      throw new Error();
    });
    const output = copyFiles(config);

    expect(spy).toHaveBeenCalledWith(
      'foo already exists. Will not overwrite.',
      'warn'
    );
  });
});
