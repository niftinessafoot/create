import { jest } from '@jest/globals';
const fs = jest.createMockFromModule('fs');

export const {
  constants,
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} = fs;
