const path = require('path');

module.exports = {
  entry: {
    app: './src/app.js',
    control: './src/control.js'
  },
  output: {
    path: path.resolve(__dirname, 'public/bundle'),
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        loader: "babel-loader",
        include: [
          path.resolve(__dirname, "src"),
        ],
        test: /\.jsx?$/,
        query: {
          presets: ['es2015']
        }
      },
      {
        loader: "shader-loader",
        test: /\.(glsl|frag|vert|fs|vs)$/,
        exclude: [/node_modules|vendors/]
      }
    ]
  }
};
