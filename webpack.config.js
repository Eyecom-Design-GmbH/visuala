const path = require("path");
 
module.exports = {
  mode: "production",
  entry: {
    ["global"]: "./src/global.js",
    ["slider-about-us"]: "./src/slider-about-us.js",
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