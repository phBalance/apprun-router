const path = require("path");

module.exports = {
  entry: {
    "pretty": "./src/pretty_link_router.ts",
    "hash": "./src/hash_link_router.ts"
  },
  output: {
    filename: "[name].js",
    library: "apprun",
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
  devServer: {
    open: true
  },
  devtool: "source-map"
}