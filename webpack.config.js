const path = require('path');

module.exports = {
  mode: 'development',

  devtool: 'inline-source-map',

  entry: './src/script.ts',

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader'
      }
    ]
  },

  resolve: {
    alias: {
      vue: 'vue/dist/vue.js'
    }
  }
};

