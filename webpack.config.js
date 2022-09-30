// this webpack file can only understand old js.
// and all the files need to have an entry and an output.
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
  entry: {
    main: "./src/frontend/js/main.js",
    videoplayer: "./src/frontend/js/videoplayer.js",
    recorder: "./src/frontend/js/recorder.js",
  }, // entry means the source code we want to process
  mode: "development",
  watch: true,
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/styles.css",
    }),
    new HtmlWebpackPlugin({
      favicon: "./src/favicon.ico",
    }),
  ],
  output: {
    filename: "js/[name].js",
    path: path.resolve(__dirname, "assets"),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
};
// "Rules" is where you asre going to define the transformations for the different kinds of files
// webpack uses loaders
// for sass. start with the last loader
