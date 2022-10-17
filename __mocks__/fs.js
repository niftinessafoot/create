const fs = jest.genMockFromModule('fs');

export const {
  constants,
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} = fs;
