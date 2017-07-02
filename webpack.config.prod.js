var webpack = require("webpack");

var ExtractTextPlugin = require("extract-text-webpack-plugin");
var WebpackMd5Hash = require("webpack-md5-hash");
var Visualizer = require("webpack-visualizer-plugin");

const GLOBALS = {
  "process.env.NODE_ENV": JSON.stringify("production"),
  __DEV__: false
};

module.exports = {
  devtool: "cheap-module-source-map", //source-map
  entry: "./src/index.js",
  target: "web",
  output: {
    path: __dirname + "/dist", // Note: Physical files are only output by the production build task `npm run build`.
    publicPath: "/",
    filename: "assets/js/bundle.js"
  },
  plugins: [
    new WebpackMd5Hash(),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin(GLOBALS),
    new ExtractTextPlugin("assets/css/main.css"),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    }),
    new Visualizer(),
    new webpack.ContextReplacementPlugin(
      /highlight\.js\/lib\/languages$/,
      new RegExp(`^./(${["javascript", "css", "bash"].join("|")})$`)
    ),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: false
      }
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        // exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["env"]
          }
        }
      },
      {
        test: /(\.css|\.scss)$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ["css-loader", "sass-loader"]
        })
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|)(\?v=[a-z0-9]\.[a-z0-9]\.[a-z0-9])?$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 10000,
            name: "assets/font/[name].[hash:8].[ext]"
          }
        }
      },
      {
        test: /\.svg(\?v=[a-z0-9]\.[a-z0-9]\.[a-z0-9])?$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 10000,
            name: "assets/img/[name].[hash:8].[ext]"
          }
        }
      },
      {
        test: /\.(png|jpe?g|gif|ico)$/,
        use: {
          loader: "file-loader",
          options: {
            name: "assets/img/[name].[ext]"
          }
        }
      },
      {
        test: /\.ico$/,
        loader: "file?name=[name].[ext]"
      },
      {
        test: /manifest.json$/,
        loader: "file-loader?name=manifest.json!web-app-manifest-loader"
      }
    ]
  }
};
