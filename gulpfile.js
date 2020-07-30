const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync');

let sassOptions = {
  errLogToConsole: true,
  outputStyle: 'compressed'
};

let browserSyncOptions = {
  server: './dist',
  open: false
};

function sassTask(cb) {
  return src('src/sass/*.{sass, scss}')
    .pipe(sourcemaps.init())
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(autoprefixer())
    .pipe(dest('dist/css'))
    .pipe(browserSync.stream())
  cb()
};

function htmlTask(cb) {
  return src('src/*.html')
  .pipe(dest('dist'))
  .pipe(browserSync.stream())
  cb()
};

function imageTask(cb) {
  return src('src/images/*')
  .pipe(dest('dist/images'))
  cb()
};

function watchTask(cb) {
  browserSync.init(browserSyncOptions)
  watch('src/sass/**/*.{sass, scss}', sassTask)
  watch('src/**/*.html', htmlTask)
  watch('src/images/*', imageTask)
  cb()
}

exports.sassTask = sassTask;
exports.htmlTask = htmlTask;
exports.imageTask = imageTask;
exports.watchTask = watchTask; 

exports.serve = series(htmlTask, sassTask, imageTask, parallel(watchTask));
exports.build = series(htmlTask, sassTask, imageTask);