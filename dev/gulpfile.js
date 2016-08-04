'use strict';

/**
 * Grab dependencies (the ES5 way since Node doesn't support ES6 modules yet)
 */
const gulp          = require('gulp');
const sass          = require('gulp-sass');
const shell         = require('gulp-shell');
const sourcemaps    = require('gulp-sourcemaps');
const browserSync   = require('browser-sync');
const reload        = browserSync.reload;
const autoprefixer  = require('gulp-autoprefixer');
const concat        = require('gulp-concat');
const minify        = require('gulp-minify');


/**
 * All our config options
 */
let config = {
  compress_sass: true,                          // true = compressed, false = expanded
  pattern_directory: './patterns',              // where your patterns live
  sass_index: './patterns/patterns.scss',       // where your source pattern.scss lives
  build_directory: '../build'                   // where to build your pattern library (match to hologram_config.yml)
};


/**
 * Compile our SCSS
 */
gulp.task('sass', ['hologram'], () => {
    return gulp.src(config.sass_index)

        // Compile Sass with sourcemaps
        .pipe( sourcemaps.init() )
        .pipe( sass({outputStyle: config.compress_sass ? 'compressed' : 'expanded'}) )

        // Add vendor prefixes for the last two browsers and drop in build folder
        .pipe( autoprefixer('last 2 version', 'ie 10') )
        .pipe( sourcemaps.write() )
        .pipe( gulp.dest(`${config.build_directory}/assets/css`) )

        // Refresh BrowserSync
        .pipe( browserSync.stream() );
});


/**
 * Concat and minify our JS
 */
gulp.task('js', ['hologram'], () => {
   return gulp.src([`${config.pattern_directory}/**/*.js`,`!${config.pattern_directory}/**/*.spec.js`])
       .pipe(concat('components.js'))
       .pipe(minify({
           ext: {
             min: '.min.js'
           },
           noSource: true
       }))
       .pipe(gulp.dest(`${config.build_directory}/assets/js`))
});


/**
 * Concat and minify our Jasmine tests
 */
gulp.task('jasmine', ['hologram', 'sass', 'js'], () => {
    return gulp.src(`!${config.pattern_directory}/**/*.spec.js`)
        .pipe(concat('components.js'))
        .pipe(minify({
            ext: {
                min: '.spec.min.js'
            },
            noSource: true
        }))
        .pipe(gulp.dest(`${config.build_directory}/assets/js`))
});


/**
 * Move our prototypes
 */
gulp.task('prototypes', () => {
    return gulp.src(`./prototypes/*.html`)
        .pipe(gulp.dest(`${config.build_directory}/prototypes`))
});


/**
 * Run the 'hologram' command and compile our pattern library
 */
gulp.task('hologram', shell.task('hologram'));


/**
 * Spin up a server with BrowserSync
 */
gulp.task('serve', ['hologram', 'sass', 'js'], () => {
    browserSync.init({
        server: {
            baseDir: config.build_directory
        }
    });

    gulp.watch([`${config.pattern_directory}/**/*.js`], ['jasmine']);
    gulp.watch(`${config.pattern_directory}/**/*.scss`, ['sass', 'js']);
    gulp.watch(`./prototypes/*.html`, ['prototypes']).on('change', reload);
    gulp.watch(`${config.build_directory}/*.html`).on('change', reload);
});


/**
 * Our default gulp task
 */
gulp.task('default', ['hologram', 'sass', 'js', 'jasmine', 'serve', 'prototypes']);