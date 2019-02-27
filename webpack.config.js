const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },

  module: {
    rules: [
      // {
      //   test: /\.(png|jpe?g)$/,
      //   include: path.resolve(__dirname, 'src'),
      //   use: [
      //     {
      //       loader: 'file-loader',
      //       options: {
      //         outputPath: 'images'
      //       }
      //     }
      //   ]
      // }
      {
        test: /\.(png|jpe?g)$/,
        include: path.resolve(__dirname, 'src'),
        use: [
          {
            loader: path.resolve(__dirname, './url-loader.js'),
            options: {
              publicPath: 'images',
              name: '[hash:8].[ext]',
              limited: 8000
            }
          }
        ]
      },
      {
        test: /\.md$/,
        include: path.resolve(__dirname, 'src'),
        use: [
          {
            loader: path.resolve(__dirname, './md-loader.js')
          }
        ]
      }
    ]
  }
};
