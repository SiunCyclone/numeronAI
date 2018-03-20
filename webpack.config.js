module.exports = {
  mode: 'development',

  entry: './src/script.ts',

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader'
      }
    ]
  },

  resolve: {
    extensions: [ '.ts' ],
    alias: { vue: 'vue/dist/vue.js' }
  }
};

