const path = require('path');

/** @type import('webpack').Configuration */
const config = {
  mode: 'development',
  context: path.join(__dirname, 'src'),
  entry: './script.ts',
  target: "web",
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'script.js',
    library: {
      name: 'UnviersalDevTools',
      export: 'default',
      type: 'umd',
    },
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
};

module.exports = config;
