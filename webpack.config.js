/* eslint-disable strict */

'use strict';

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  output: {
    library: 'ReduxApist',
    libraryTarget: 'umd',
  },
};
