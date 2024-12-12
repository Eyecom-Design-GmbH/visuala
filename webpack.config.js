const path = require("path");
 
module.exports = {
  mode: "production",
  entry: {
    ["slider-feedback"]: "./src/slider-feedback.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    library: "[name]",
    libraryTarget: "umd",
    globalObject: "this",
    umdNamedDefine: true,
    clean: true,
  },
};