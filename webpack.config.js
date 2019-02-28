const path = require('path');
const HtmlPlugin = require('./plugin/html-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },

  module: {
    rules: [
      {
        test: /\.(png|jpe?g)$/,
        include: path.resolve(__dirname, 'src'),
        use: [
          {
            loader: path.resolve(__dirname, './loader/url-loader.js'),
            options: {
              publicPath: 'images',
              name: '[hash:8].[ext]',
              limit: 8000,
            }
          }
        ]
      },
      {
        test: /\.md$/,
        include: path.resolve(__dirname, 'src'),
        use: [
          {
            loader: path.resolve(__dirname, './loader/md-loader.js')
          }
        ]
      }
    ]
  },

  plugins: [
    new HtmlPlugin()
  ]
};
