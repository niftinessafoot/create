const base = {
  version: '0.1.0',
  description: '',
  author: 'Matthew Smith <code@niftinessafoot.com> (https://www.afoot.dev)',
  private: true,
  license: 'MIT',
  browserslist: ['defaults'],
  type: 'module',
  files: ['./dist/'],
};

const defaultExports = {
  default: '',
  import: '',
  require: '',
};

const exports = {
  '.': defaultExports,
};
const exportsTypes = {
  '.': { ...defaultExports, types: './types/index.d.ts' },
};

const scripts = {
  build: 'rollup -c rollup.config.js -i ./src/index.js',
  'build:dev': 'rollup -c rollup.config.dev.js -i ./src/index.js',
  'build:prod': 'npm run build && npm run types',
  clean: 'rm -f ./dist/*',
  docs: 'typedoc',
  'prebuild:prod': 'npm run clean',
  'prep:umd': 'node ./lib/init-umd-config.js',
  prepack: 'npm run build:prod && npm run prep:umd',
  test: 'jest',
  'test:coverage': 'jest --coverage',
  watch: 'nodemon --exec "npm run build:dev" --watch src/ -e ts,js',
};

export const expectedModuleJson = {
  name: '@afoot/test-module',
  keywords: ['module'],
  bugs: 'https://github.com/niftinessafoot/test-module',
  repository: {
    type: 'git',
    url: 'https://github.com/niftinessafoot/test-module',
  },
  homepage: 'https://github.com/niftinessafoot/test-module',
  main: './dist/umd/index.js',
  module: './dist/umd/index.js',
  scripts: scripts,
  exports,
  ...base,
};

export const expectedModuleReactJson = {
  ...expectedModuleJson,
  keywords: ['module', 'react'],
  scripts: {
    ...scripts,
    build: 'rollup -c rollup.config.js -i ./src/index.jsx',
    'build:dev': 'rollup -c rollup.config.dev.js -i ./src/index.jsx',
  },
};

export const expectedModuleTypescriptJson = {
  ...expectedModuleJson,
  exports: exportsTypes,
  keywords: ['module', 'typescript'],
  types: `./types/index.d.ts`,
  scripts: {
    ...scripts,
    build: 'rollup -c rollup.config.js -i ./src/index.ts',
    'build:dev': 'rollup -c rollup.config.dev.js -i ./src/index.ts',
    types: 'tsc',
  },
};

export const expectedModuleReactTypescriptJson = {
  ...expectedModuleJson,
  exports: exportsTypes,
  keywords: ['module', 'react', 'typescript'],
  types: `./types/index.d.ts`,
};

export const expectedSiteJson = {
  name: '@afoot/test-site',
  keywords: [],
  bugs: 'https://github.com/niftinessafoot/test-site',
  repository: {
    type: 'git',
    url: 'https://github.com/niftinessafoot/test-site',
  },
  homepage: 'https://github.com/niftinessafoot/test-site',
  ...base,
};
