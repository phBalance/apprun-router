const path = require("path");
const PeerDepsExternalsPlugin = require('peer-deps-externals-webpack-plugin');

module.exports = {
  entry: {
    "pretty": "./src/pretty.ts",
    "hash": "./src/hash.ts"
  },
  output: {
    filename: "[name].js",
    library: "apprun-router",
    libraryTarget: "umd",
    path: path.resolve(__dirname),
    globalObject: "this"
  },
  resolve: {
    extensions: [".ts", ".tsx"]
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: "ts-loader" }
    ]
  },
  plugins: [
     new PeerDepsExternalsPlugin()
  ],
  devServer: {
    open: true
  },
  devtool: "source-map"
}