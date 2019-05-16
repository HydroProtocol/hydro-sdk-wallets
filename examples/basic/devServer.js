var path = require("path");
var express = require("express");
var webpack = require("webpack");
var config = require("./webpack.config.dev");
var https = require("https");
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

https
  .createServer(
    {
      key: fs.readFileSync("./certs/server.key"),
      cert: fs.readFileSync("./certs/server.crt"),
      spdy: {
        protocols: ["http/1.1"]
      }
    },
    app
  )
  .listen(3030, "localhost", function(err) {
    if (err) {
      console.log(err);
      return;
    }

    console.log("Listening at https://localhost:3030");
  });
