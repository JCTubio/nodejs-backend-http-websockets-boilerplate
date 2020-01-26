const path = require("path");

module.exports = {
  mode: "development",
  entry: path.resolve(__dirname),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    publicPath: "/"
  },
  resolve: {
    extensions: [".js"]
  },
  module: {
    rules: [
      {
        test: /.js/,
        loader: "babel-loader"
      }
    ]
  }
};
