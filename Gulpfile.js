"use strict";

var autoprefixer = require("gulp-autoprefixer");
var cssnano = require("gulp-cssnano");
var browserSync = require("browser-sync").create();
const hygienist = require("hygienist-middleware");
var fs = require("fs");
var gulp = require("gulp");
var gutil = require("gulp-util");
var handlebars = require("gulp-compile-handlebars");
var htmlmin = require("gulp-htmlmin");
var imagemin = require("gulp-imagemin");
var inlinesource = require("gulp-inline-source");
var layouts = require("handlebars-layouts");
var plumber = require("gulp-plumber");
var rename = require("gulp-rename");
var reload = browserSync.reload;
var replace = require("gulp-replace");
var yaml = require("js-yaml");
var rimraf = require("rimraf");
var runSequence = require("run-sequence");
var path = require("path");
var webpack = require("webpack");
var config = require("./webpack.config.dev");
var configProd = require("./webpack.config.prod");
var webpackHotMiddleware = require("webpack-hot-middleware");
var webpackDevMiddleware = require("webpack-dev-middleware");

handlebars.Handlebars.registerHelper(layouts(handlebars.Handlebars));
const bundler = webpack(config);

gulp.task("webpack", function(callback) {
  webpack(config, function(err, stats) {
    if (err) throw new gutil.PluginError("webpack:build", err);
    gutil.log(
      "[webpack:build] Completed\n" +
        stats.toString({
          assets: true,
          chunks: false,
          chunkModules: false,
          colors: true,
          hash: false,
          timings: false,
          version: false
        })
    );
    callback();
  });
});

gulp.task("webpack:optimized", function(callback) {
  webpack(configProd, function(err, stats) {
    if (err) throw new gutil.PluginError("webpack:build", err);
    gutil.log(
      "[webpack:build] Completed\n" +
        stats.toString({
          assets: true,
          chunks: false,
          chunkModules: false,
          colors: true,
          hash: false,
          timings: false,
          version: false
        })
    );
    callback();
  });
});

gulp.task("css:optimized", function() {
  return gulp
    .src("./dist/assets/css/*.css")
    .pipe(plumber())
    .pipe(autoprefixer())
    .pipe(cssnano({ discardComments: { removeAll: true } }))
    .pipe(gulp.dest("dist/assets/css/"));
});

gulp.task("images", function() {
  return gulp
    .src("src/assets/img/**/*")
    .pipe(plumber())
    .pipe(
      imagemin({
        progressive: true
      })
    )
    .pipe(gulp.dest("./dist/assets/img"));
});

gulp.task("images:optimized", function() {
  return gulp
    .src("src/assets/img/**/*")
    .pipe(plumber())
    .pipe(
      imagemin({
        progressive: true,
        multipass: true
      })
    )
    .pipe(gulp.dest("./dist/assets/img"));
});

gulp.task("fonts", function() {
  return gulp.src("src/font/*").pipe(plumber()).pipe(gulp.dest("./dist/font"));
});

gulp.task("templates", function() {
  var templateData = yaml.safeLoad(fs.readFileSync("data.yml", "utf-8"));
  var options = {
    ignorePartials: true, //ignores the unknown footer2 partial in the handlebars template, defaults to false
    batch: ["./src/views/partials/"],
    helpers: {
      capitals: function(str) {
        return str.toUpperCase();
      }
    }
  };

  return gulp
    .src("./src/views/templates/**/*.hbs")
    .pipe(plumber())
    .pipe(handlebars(templateData, options))
    .pipe(
      rename(function(path) {
        path.extname = ".html";
      })
    )
    .pipe(gulp.dest("dist"));
});

gulp.task("templates:optimized", ["templates"], function() {
  return gulp
    .src("./dist/**/*.html")
    .pipe(inlinesource())
    .pipe(replace(/\.\.\//g, ""))
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        removeComments: true
      })
    )
    .pipe(gulp.dest("./dist/"));
});

gulp.task("clean", function(cb) {
  return rimraf("./dist/", cb);
});

gulp.task("watch", function() {
  gulp.watch(
    [
      "./src//views/templates/**/*.hbs",
      "./src//views/partials/**/*.hbs",
      "data.yml"
    ],
    ["templates"],
    reload
  );
  // gulp.watch('./src/assets/css/**/*.scss', ['webpack']);
  gulp.watch("./src/assets/img/**/*", ["images"], reload);
  // gulp.watch(['./src/assets/js/**/*.js', './src/index.js', 'Gulpfile.js'], ['webpack']);
});

gulp.task("build", function(cb) {
  return runSequence("clean", ["images", "fonts", "webpack", "templates"], cb);
});

gulp.task("build:optimized", function(cb) {
  return runSequence(
    "clean",
    ["images", "webpack:optimized", "templates"],
    "css:optimized",
    cb
  );
});

// use default task to launch Browsersync and watch JS files
gulp.task("serve", ["build"], function() {
  // Serve files from the root of this project
  browserSync.init(["./dist/**/*"], {
    port: process.env.port || 3000,
    server: {
      baseDir: "dist",
      middleware: [
        // historyApiFallback(),
        hygienist("dist"),
        webpackDevMiddleware(bundler, {
          // Dev middleware can't access config, so we provide publicPath
          publicPath: config.output.publicPath,

          // These settings suppress noisy webpack output so only errors are displayed to the console.
          noInfo: false,
          quiet: true, //was false changed for webpack-dashboard
          stats: {
            assets: false,
            colors: true,
            version: false,
            hash: false,
            timings: false,
            chunks: false,
            chunkModules: false
          }

          // for other settings see
          // http://webpack.github.io/docs/webpack-dev-middleware.html
        }),
        webpackHotMiddleware(bundler, {
          log: () => {}
        })
      ]
    }
  });

  // add browserSync.reload to the tasks array to make
  // all browsers reload after tasks are complete.
  gulp.start(["watch"]);
});
