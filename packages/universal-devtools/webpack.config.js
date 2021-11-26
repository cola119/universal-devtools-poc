const path = require('path');

/** @type import('webpack').Configuration */
const config = {
  context: path.join(__dirname, 'src'),
  entry: './script.ts',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'script.js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  mode: 'development',
};

module.exports = config;
