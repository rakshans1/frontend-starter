[![forthebadge](http://forthebadge.com/images/badges/60-percent-of-the-time-works-every-time.svg)]()
[![forthebadge](http://forthebadge.com/images/badges/built-with-love.svg)]()
[![forthebadge](http://forthebadge.com/images/badges/uses-html.svg)]()
[![forthebadge](http://forthebadge.com/images/badges/uses-css.svg)]()
[![forthebadge](http://forthebadge.com/images/badges/uses-git.svg)]()
[![forthebadge](http://forthebadge.com/images/badges/uses-js.svg)]()
[![forthebadge](http://forthebadge.com/images/badges/powered-by-netflix.svg)]()
[![forthebadge](http://forthebadge.com/images/badges/winter-is-coming.svg)]()
[![](http://forthebadge.com/images/badges/check-it-out.svg)]()

Project Template
========================================

#### _Because web development doesn't need to be a pain._

The project template is the way to build static sites fast.  With one command, build a static page using [Webpack][webpack], [Gulp][gulp], [Handlebars.js][handlebars], and [SCSS][scss].

[ES6]

## Features

- Install the project in just three commands (see "Developing" below).
- Use [Handlebars.js][handlebars] to keep our HTML organized into templates and partials.
- Use [SCSS][scss] to keep our CSS organized into logical components.
- Use [Browsersync][browsersync] to automatically launch a development version of our website, reload the page whenever we change the HTML, and inject changes to CSS, JavaScript, and images with needing to reload.
- Use [HTML Minifier][htmlmin], and optimize our HTML, CSS, JavaScript, and images, respectively.

All with one command from the terminal:

```bash
yarn start
```

## Setup

```bash
npm install -g gulp  # May require `sudo`
```

## Developing

```bash
yarn install            # One time
gulp serve
```

## Reminders

If you want to use this repo for your next project, make sure to make the following changes:

1. Edit `data.yml`, filling in the HTML metadata associated with your site.
2. Edit `package.json` providing a `name`, `version`, `description`, `license`, and `repository.url`.
3. Remove the `.git` folder, so that you start from a fresh commit history.
4. Edit `README.md` to your preference.

## Gulp Commands

An overview of Gulp commands available:

### `gulp build`

Builds the site into the `dist` directory.  This includes:

- SCSS, sourcemaps and autoprefixing
- JS uglification
- Handlebars to HTML

### `gulp build:optimized`

This is used for distributing an optimized version of the site (for deployment).  It includes everything from `gulp build` as well as:
- SCSS minification
- CSS / JS inline-sourcing 

### `gulp watch`

Watchs for changes in local files and rebuilds parts of the site as necessary, into the `dist` directory.

### `gulp serve`

Runs `gulp watch` in the background, and serves the `dist` directory at `localhost:3000` with automatic reloading using [Browsersync][browsersync].

## Structure

```bash
├── webpack.config.dev.js   # Controls javascript and css bundling
├── Gulpfile.js             # Controls Gulp, used for building the website
├── README.md               # This file
├── data.yml                # Metadata associated with the site.
├── dist/                   # Gulp builds the static site into this directory
├── package.json            # Dependencies
└── src/                    # All source code
    ├── assets/ 
        ├── css/            # Stylesheets
        ├── font/           # Font files
        ├── img/            # Images and SVGs
        ├── js/             # Javascript libraries and scripts
    ├── views/     
        ├── partials/       # Handlebars HTML partials that are included / extended
        └── templates/      # Handlebars HTML files, one per page on the site.
```

[browsersync]: http://www.browsersync.io/
[gulp]: http://gulpjs.com/
[handlebars]: http://handlebarsjs.com/
[htmlmin]: https://github.com/kangax/html-minifier
[imagemin]: https://github.com/imagemin/imagemin
[npm-install]: https://nodejs.org/en/download/
[scss]: http://sass-lang.com/
[webpack]: https://webpack.js.org/
