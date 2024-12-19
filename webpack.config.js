const path = require("path");
 
module.exports = {
  mode: "production",
  entry: {
    ["global"]: "./src/global.js",
    ["slider-about-us"]: "./src/slider-about-us.js",
    ["slider-impressions"]: "./src/slider-impressions.js",
    // ["gsap-animations"]: "./src/gsap-animations.js",
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