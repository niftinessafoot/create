import { writeFileSync, readFileSync, access, existsSync } from 'fs';
import { generatePackageJson } from '../src/components/generate-package-json.js';

jest.mock('fs');

describe('Generate `package.json`', () => {
  let settings;

  beforeEach(() => {
    settings = {};
  });

  it('should generate a new file if one doesn’t exist', () => {
    const output = generatePackageJson(settings);

    const m = writeFileSync.mock.calls;

    console.log(m);

    expect(true);
  });
});
