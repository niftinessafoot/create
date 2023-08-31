/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const { access, constants } = require('fs');
const yaml = require('yamljs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const isDev = process.env.NODE_ENV !== 'production';
const glob = require('glob');

const pages = Object.fromEntries(
  glob.sync('./src/pages/**/*.{tsx,jsx}').map((file) => {
    const key = file
      .split('/')
      .pop()
      .replace(/\.(j|t)sx$/, '');
    return [key, file];
  })
);

const getIndexFile = (filename = 'index') => {
  const root = `./src`;
  const basePath = `${root}/${filename}`;
  const js = `.jsx`;
  const ts = `.tsx`;

  let extension = ts;

  try {
    accessSync(`${basePath}${extension}`, constants.F_OK);
  } catch (err) {
    extension = js;
  }

  return `${basePath}${extension}`;
};

const entries = {
  index: getIndexFile(),
  ...pages,
};
const addHTMLPages = (() => {
  return Object.keys(entries).map((ele) => {
    return new HtmlWebpackPlugin({
      filename: `${ele}.html`,
      chunks: [ele],
      template: 'webpack.template.html',
    });
  });
})();

module.exports = {
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    hot: true,
  },
  devtool: 'inline-source-map',
  entry: entries,
  mode: isDev ? 'development' : 'production',
  output: {
    assetModuleFilename: '[name][ext]',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  resolve: {
    extensions: ['.tsx', '.jsx', '.ts', '...'],
    alias: {
      '@components': path.resolve(__dirname, 'src/components/'),
      '@styles': path.resolve(__dirname, 'src/styles/'),
      '@pages': path.resolve(__dirname, 'src/pages/'),
    },
    symlinks: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { sourceMap: true } },
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { sourceMap: true } },
          { loader: 'sass-loader', options: { sourceMap: true } },
        ],
      },
      {
        test: /\.yaml$/i,
        type: 'json',
        parser: {
          parse: yaml.parse,
        },
      },
      {
        test: /\.(j|t)sx?$/i,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|svg|jpg|gif|ico|webp)$/i,
        type: 'asset/resource',
        exclude: /node_modules/,
        generator: {
          filename: 'i/[hash][ext][query]',
        },
      },
      {
        test: /\.(woff|woff2|ttf)$/i,
        type: 'asset/resource',
        exclude: /node_modules/,
      },
      {
        test: /\.(mp4|ogg)$/i,
        type: 'asset/resource',
        exclude: /node_modules/,
      },
      {
        test: /\.(txt|json|md)$/i,
        type: 'asset/source',
        exclude: /node_modules/,
      },
      /*       {
        test: /\.html$/,
        type: 'asset/resource',
        generator: {
          filename: '[name][ext]',
        },
      },
      {
        test: /\.html$/i,
        use: [
          'extract-loader',
          { loader: 'html-loader', options: { esModule: true } },
        ],
      }, */
    ],
  },
  plugins: [new MiniCssExtractPlugin()].concat(addHTMLPages),
};
