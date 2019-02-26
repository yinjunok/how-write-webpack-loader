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
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        use: [
          {
            loader: path.resolve(__dirname, './loader.js'),
            options: {/* ... */}
          }
        ]
      }, 
      {
        test: /\.png$/,
        include: path.resolve(__dirname, 'src'),
        use: [
          {
            loader: path.resolve(__dirname, './loader.js'),
            options: {
              test: '测试的'
            }
          }
        ]
      }, 
    ]
  }
};
