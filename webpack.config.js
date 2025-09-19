const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "production",
  entry: {
    ["global"]: "./src/global.js",
    ["home"]: "./src/home.js",
    ["angebot"]: "./src/angebot.js",
    ["projects"]: "./src/projects.js",
    ["kontakt"]: "./src/kontakt.js",
    ["agentur"]: "./src/agentur.js",
    ["typewriter"]: "./src/typewriter.js",
    ["text-reveal"]: "./src/text-reveal.js",
    ["marquee"]: "./src/marquee.js",
    ["image-animations"]: "./src/image-animations.js",
    ["title-animations"]: "./src/title-animations.js",
    ["call-embed"]: "./src/call-embed.js",
    ["projects-detail"]: "./src/projects-detail.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    library: "[name]",
    libraryTarget: "umd",
    globalObject: "this",
    umdNamedDefine: true,
    clean: true,
    publicPath: "/",            // makes “/videos/…“ work nicely on Pages
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: "public", to: "." }], // copies public/* into dist/*
    }),
  ],
};
