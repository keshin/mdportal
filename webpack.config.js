var path = require('path');
var webpack = require("webpack");
var node_modules = path.resolve(__dirname, 'node_modules');
module.exports = {
  entry: {
    app: path.resolve(__dirname, 'src/main.js'),
    vendor: ["jquery", "react", "react-dom", "react-router", "history", "bootstrap/dist/css/bootstrap.min.css", "urijs", "marked"]
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: "build/",
    filename: 'bundle.js'
  },
  externals: {
    "document.config": "documentConfig"
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel?presets[]=react,presets[]=es2015' // 'babel-loader' is also a legal name to reference
    },{
      test: /\.css$/,
      loader: "style!css"
    },
    { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,   loader: "url?limit=10000&mimetype=application/font-woff" },
    { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,   loader: "url?limit=10000&mimetype=application/font-woff2" },
    { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,    loader: "url?limit=10000&mimetype=application/octet-stream" },
    { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,    loader: "file" },
    { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,    loader: "url?limit=10000&mimetype=image/svg+xml" }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.bundle.js")
  ]
};
