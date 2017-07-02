var webpack = require("webpack");
var path = require("path");

module.exports = {
  devtool: "eval",
  entry: [
    "./src/webpack-public-path",
    "webpack-hot-middleware/client?reload=true", //note that it reloads the page if hot module reloading fails.
    "./src/index.js"
  ],
  target: "web",
  output: {
    path: __dirname + "/dist", // Note: Physical files are only output by the production build task `npm run build`.
    publicPath: "/",
    filename: "bundle.js"
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("development"), // Tells React to build in either dev or prod modes. https://facebook.github.io/react/downloads.html (See bottom)
      __DEV__: true
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["env"]
          }
        }
      },
      {
        test: /(\.css|\.scss)$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader", options: { sourceMap: true } },
          { loader: "sass-loader", options: { sourceMap: true } }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|svg|)(\?v=[a-z0-9]\.[a-z0-9]\.[a-z0-9])?$/,
        use: ["url-loader?limit=100000r"]
      },
      {
        test: /\.(png|jpg|gif|ico)$/,
        use: ["file-loader"]
      }
    ]
  }
};
