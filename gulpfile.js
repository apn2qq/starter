'use strict';

const browserSync = require('browser-sync'),
  babel = require('gulp-babel'),
  cache = require('gulp-cache'),
  concat = require('gulp-concat'),
  env = require('minimist')(process.argv.slice(2)),
  gulp = require('gulp'),
  gulpif = require('gulp-if'),
  gutil = require('gulp-util'),
  imagemin = require('gulp-imagemin'),
  minifyHtml = require('gulp-minify-html'),
  nunjucks = require('gulp-nunjucks-html'),
  plumber = require('gulp-plumber'),
  scss = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  sourcemaps = require('gulp-sourcemaps'),
  uglify = require('gulp-uglify');


// Nunjucks
gulp.task('nunjucks', () => {
  return gulp.src('src/*.html')
    .pipe(plumber())
    .pipe(nunjucks({
      searchPaths: ['src/templates/']
    }))
    .pipe(gulpif(env.p, minifyHtml()))
    .pipe(gulp.dest('build/'));
});

// Scss
gulp.task('scss', function () {
  gulp.src('src/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(scss({
      outputStyle: 'expand'
    }))
    .pipe(autoprefixer(['last 10 versions']))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/assets/css/'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// Uglify and Concat JS
gulp.task('js', () => {
  return gulp.src('src/assets/js/**/*.js')
    .pipe(plumber())
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(uglify())
    .pipe(gulp.dest('build/assets/js/'))
});

// Imagemin
gulp.task('images', () => {
  gulp.src('src/assets/img/**/*')
    .pipe(plumber())
    .pipe(imagemin({
      interlaced: true,
      progressive: true,
      optimizationLevel: 2
    }))
    .pipe(gulp.dest('build/assets/img'));
});

// Watch
gulp.task('watch', () => {
  gulp.watch('src/**/*.html', ['nunjucks']);
  gulp.watch('src/scss/**/*.scss', ['scss']);
  gulp.watch('src/assets/js/**/*.js', ['js']);
  gulp.watch('src/assets/img/**/*.{jpg,png,gif}', ['imagemin']);
});

// Browsesync
gulp.task('browser-sync', () => {
  let files = [
    'build/**/*.html',
    'build/assets/css/**/*.css',
    'build/assets/img/**/*',
    'build/assets/js/**/*.js'
  ];

  browserSync({
    files: ['./build/**/*.*'],
    port: 8080,
    server: {
      baseDir: './build/'
    },
    notify: false
  });
});

// default
gulp.task('default', ['nunjucks', 'js', 'scss', 'images', 'watch', 'browser-sync']);
