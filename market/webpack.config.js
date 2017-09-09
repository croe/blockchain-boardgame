const webpack = require('webpack');

module.exports = {
  entry: './app',

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
          plugins: ['transform-react-jsx'],
        },
      },
      {
        test: /\.css$/,
        loaders: ['style', 'css?modules'],
      },
    ],
  },

  output: {
    path: __dirname + '/build',
    filename: 'bundle.js',
  },

  resolve: {
    extensions: ['', '.js', '.jsx'],
  },

  devServer: {
    contentBase: 'build',
    port: 3000
  }

};
