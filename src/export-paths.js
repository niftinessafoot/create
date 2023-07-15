export const types = `/types/index.d.ts`;
export const main = `/umd/index.js`;
export const module = `/umd/index.js`;
export const exports = {
  '.': {
    types: `./types/index.d.ts`,
    require: `./umd/index.js`,
    import: `./esm/index.js`,
    default: `./umd/index.js`,
  },
  './standalone': {
    types: `./types/index.d.ts`,
    require: `./umd/standalone.js`,
    import: `./esm/standalone.js`,
    default: `./umd/legacy.js`,
  },
  './legacy': `./umd/legacy.js`,
};
