export const types = `${dist}/types/index.d.ts`;
export const main = `${dist}/umd/index.js`;
export const module = `${dist}/umd/index.js`;
export const exports = {
  '.': {
    types: `./${dist}/types/index.d.ts`,
    require: `./${dist}/umd/index.js`,
    import: `./${dist}/esm/index.js`,
    default: `./${dist}/umd/index.js`,
  },
  './standalone': {
    types: `./${dist}/types/index.d.ts`,
    require: `./${dist}/umd/standalone.js`,
    import: `./${dist}/esm/standalone.js`,
    default: `./${dist}/umd/legacy.js`,
  },
  './legacy': `./${dist}/umd/legacy.js`,
};
