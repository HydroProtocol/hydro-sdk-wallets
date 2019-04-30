var path = require("path");
var webpack = require("webpack");

module.exports = {
  devtool: "eval",
  mode: "development",
  entry: [
    "babel-polyfill",
    "eventsource-polyfill", // necessary for hot reloading with IE
    "webpack-hot-middleware/client",
    "./src/index.js"
  ],
  externals: {
    react: "React",
    "react-dom": "ReactDOM",
    redux: "Redux",
    "react-redux": "ReactRedux"
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "bundle.js",
    publicPath: "/dist/"
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  resolve: {
    modules: ["src", "node_modules"],
    extensions: [".json", ".js"]
  },
  node: {
    fs: "empty",
    child_process: "empty",
    net: "empty",
    tls: "empty"
  },
  module: {
    rules: [
      {
        test: /\.jsx?/,
        use: ["babel-loader", "eslint-loader"],
        include: path.join(__dirname, "src")
      },
      // {
      //   test: /\.json$/,
      //   use: "json-loader"
      // },
      {
        test: /\.md/,
        use: ["html-loader", "markdown-loader"]
      },
      {
        test: /\.css/,
        use: ["style-loader", "css-loader"]
      }
    ]
  }
};
