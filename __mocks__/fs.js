import { jest } from '@jest/globals';
const fs = jest.createMockFromModule('fs');

fs.statSync = (path, options) => ({
  isDirectory: (bool) => bool,
});

export const {
  constants,
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdir,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} = fs;
