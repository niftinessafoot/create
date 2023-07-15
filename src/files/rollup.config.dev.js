import { babel } from '@rollup/plugin-babel';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

export default {
  output: [
    {
      // TypeScript and React Transpiled JS module (ESM)
      // Bundle-ready. Assumed will be transpiled on future builds.
      file: 'dist/esm/index.js',
      format: 'esm',
      plugins: [],
      sourcemap: true,
    },
  ],
  plugins: [
    babel({ babelHelpers: 'bundled', extensions, include: ['src/**/*'] }),
  ],
};
