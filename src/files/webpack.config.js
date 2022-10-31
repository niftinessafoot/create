const path = require('path');
const yaml = require('yamljs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const isDev = process.env.NODE_ENV !== 'production';
const glob = require('glob');

const pages = Object.fromEntries(
  glob.sync('./src/pages/**/*.tsx').map((file) => {
    const key = file.split('/').pop().replace('.tsx', '');
    return [key, file];
  })
);

const entries = {
  // index: './src/index.tsx',
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
    static: './dist',
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
      Components: path.resolve(__dirname, 'src/components/'),
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
        test: /\.jsx?$/i,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.tsx?$/i,
        use: 'ts-loader',
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
        test: /\.(txt|json)$/i,
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
