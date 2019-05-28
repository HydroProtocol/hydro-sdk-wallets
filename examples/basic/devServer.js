var path = require("path");
var express = require("express");
var webpack = require("webpack");
var config = require("./webpack.config.dev");
var http = require("http");
var fs = require("fs");

var app = express();
var compiler = webpack(config);

app.use(
  require("webpack-dev-middleware")(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
  })
);

app.use(require("webpack-hot-middleware")(compiler));

app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

http.createServer(app).listen(3030, "0.0.0.0", function(err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log("Listening at https://localhost:3030");
});
