var path = require('path');

module.exports = {
  entry: {
    'example/bundle': './example/index'
  },

  output: {
    path: '.',
    filename: '[name].js',
    publicPath: '/example/'
  },

  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
    ]
  },

  devServer: {
    contentBase: './example',
    host: 'localhost',
    inline: true,
    info: false
  }
};

