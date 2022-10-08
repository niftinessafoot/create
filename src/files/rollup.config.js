import { babel } from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

export default {
  output: {
    dir: 'dist',
    format: 'umd',
    name: 'bundle.js',
    sourcemap: true,
  },
  plugins: [
    babel({ babelHelpers: 'bundled', extensions, include: ['src/**/*'] }),
    terser(),
  ],
};
