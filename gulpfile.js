'use strict';

const browserSync = require('browser-sync'),
    gulp = require('gulp'),
    nunjucks = require('gulp-nunjucks-html'),
    plumber = require('gulp-plumber'),
    scss = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    imagemin = require('gulp-imagemin'),
    csscomb = require('gulp-csscomb'),
    uncss = require('gulp-uncss'),
    sourcemaps = require('gulp-sourcemaps');


// Nunjucks
gulp.task('nunjucks', () => {
    return gulp.src('src/*.html')
        .pipe(plumber())
        .pipe(nunjucks({
            searchPaths: ['src/templates/']
        }))
        .pipe(gulp.dest('build/'));
});

// Scss
gulp.task('scss', function() {
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

// Js
gulp.task('js', () => {
    return gulp.src('src/assets/js/**/*.js')
        .pipe(plumber())
        .pipe(gulp.dest('build/assets/js/'))
});

// Images

gulp.task('images', () => {
    gulp.src('src/assets/img/**/*')
        .pipe(plumber())
        .pipe(gulp.dest('build/assets/img'));
});

// Watch
gulp.task('watch', () => {
    gulp.watch('src/**/*.html', ['nunjucks']);
    gulp.watch('src/scss/**/*.scss', ['scss']);
    gulp.watch('src/assets/js/**/*.js', ['js']);
    gulp.watch('src/assets/img/**/*.{jpg,png,gif}');
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

// super build

gulp.task('uncss', function() {
    return gulp.src('build/assets/css/style.css')
        .pipe(uncss({
            html: ['build/index.html'],
            ignore: ['.visible', '.hidden']
        }))
        .pipe(gulp.dest('build/assets/css'));
});

gulp.task('imagemin', function() {
    return gulp.src('build/assets/img/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('build/assets/img'));
});

gulp.task('csscomb', function() {
    return gulp.src('build/assets/css/style.css')
        .pipe(csscomb())
        .pipe(gulp.dest('build/assets/css'));
});

gulp.task('super-build', [
    'uncss',
    'imagemin',
    'csscomb'
]);