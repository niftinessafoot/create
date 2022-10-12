import JestHasteMap from 'jest-haste-map';
import { copyFiles } from '../src/components/copy-files.js';
import config from '../__mocks__/config.mock.json';

// jest.mock(copyFiles);

describe('Copy Files', () => {
  it('should ', () => {
    copyFiles(config);

    console.log(copy);
    // expect(copy).toHaveBeenCalled();
  });
});
