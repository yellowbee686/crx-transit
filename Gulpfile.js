'use strict';

//npm install gulp gulp-minify-css gulp-uglify gulp-clean gulp-cleanhtml gulp-jshint gulp-strip-debug gulp-zip --save-dev

var gulp       = require('gulp')
  , clean      = require('gulp-clean')
  , concat     = require('gulp-concat')
  , cleanhtml  = require('gulp-cleanhtml')
  , minifycss  = require('gulp-minify-css')
  , jshint     = require('gulp-jshint')
  , uglify     = require('gulp-uglify')
  , zip        = require('gulp-zip');

//clean build directory
gulp.task('clean', function() {
  return gulp.src('build/*', {read: false})
  .pipe(clean());
});

//copy static folders to build directory
gulp.task('copy', function() {
  gulp.src('src/manifest.json')
    .pipe(gulp.dest('build'));
  gulp.src('src/*.html')
    .pipe(gulp.dest('build'));
  gulp.src('src/img/**')
    .pipe(gulp.dest('build/img'));
});

gulp.task('scripts', function() {
  gulp.src([
    'bower_components/jquery/dist/jquery.min.js',
    'bower_components/sugar/release/sugar.min.js',
    'src/js/application.js'])
    .pipe(jshint())
    .pipe(uglify())
    .pipe(concat('application.js'))
    .pipe(gulp.dest('build/js'));
  gulp.src([
    'src/js/*/**.js',
    'src/js/*.js',
    '!src/js/application.js'])
    .pipe(jshint())
    .pipe(uglify())
    .pipe(gulp.dest('build/js'));
});

gulp.task('styles', function() {
  gulp.src('src/css/*.css')
    .pipe(minifycss())
    .pipe(gulp.dest('build/css'));
});

gulp.task('build', ['scripts', 'styles', 'copy']);

gulp.task('zip', ['clean', 'build'], function() {
  var manifest = require('./src/manifest');
  var filename = manifest.name + ' v' + manifest.version + '.zip';

  return gulp.src('build/**')
  .pipe(zip(filename))
  .pipe(gulp.dest('dist'));
});

//run all tasks after build directory has been cleaned
gulp.task('default', ['build']);