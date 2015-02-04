'use strict';

//npm install gulp gulp-minify-css gulp-uglify gulp-clean gulp-cleanhtml gulp-jshint gulp-strip-debug gulp-zip --save-dev

var gulp       = require('gulp')
  , watch      = require('gulp-watch')
  , clean      = require('gulp-clean')
  , concat     = require('gulp-concat')
  , sass       = require('gulp-sass')
  , cleanhtml  = require('gulp-cleanhtml')
  , minifycss  = require('gulp-minify-css')
  , jshint     = require('gulp-jshint')
  , uglify     = require('gulp-uglify')
  , zip        = require('gulp-zip');

var paths = {
  'static': [
    'src/manifest.json',
    'src/*.html',
    'src/img/**/*'
  ],

  'styles': [
    'src/stylesheets/*.scss'
  ],

  'js:app': [
    'bower_components/jquery/dist/jquery.min.js',
    'bower_components/sugar/release/sugar.min.js',
    'src/js/application.js'
  ],

  'js:page': [
    'src/js/contentscripts/*.js'
  ],

  'js:trans': [
    'src/js/translators/*.js'
  ],

  'js:static': [
    'bower_components/angular/angular.js',
    'src/js/*.js',
    '!src/js/application.js'
  ],

  'css': [
    'src/css/*.css'
  ],

};

gulp.task('clean', function() {
  return gulp.src('build/*', {read: false})
  .pipe(clean());
});

gulp.task('copy', function() {
  gulp.src(paths['static'], { base: 'src' })
    .pipe(gulp.dest('build'));
});

gulp.task('scripts', function() {
  gulp.src(paths['js:app'])
    .pipe(jshint())
    .pipe(concat('application.js'))
    .pipe(gulp.dest('build/js'));

  gulp.src(paths['js:page'])
    .pipe(jshint())
    .pipe(concat('contentscript.js'))
    .pipe(gulp.dest('build/js'));

  gulp.src(paths['js:trans'])
    .pipe(jshint())
    .pipe(concat('translators.js'))
    .pipe(gulp.dest('build/js'));

  gulp.src(paths['js:static'])
    .pipe(jshint())
    .pipe(gulp.dest('build/js'));
});

gulp.task('styles', function() {
  gulp.src(paths['styles'])
    .pipe(sass())
    .pipe(gulp.dest('build/css'));

  gulp.src(paths['css'])
    .pipe(gulp.dest('build/css'));
});

gulp.task('build', ['scripts', 'styles', 'copy']);

gulp.task('watch', function() {
  gulp.watch(paths['static'], ['copy']);
  gulp.watch(paths['js:app'], ['scripts']);
  gulp.watch(paths['js:page'], ['scripts']);
  gulp.watch(paths['js:trans'], ['scripts']);
  gulp.watch(paths['js:static'], ['scripts']);
  gulp.watch(paths['css'], ['styles']);
  gulp.watch(paths['styles'], ['styles']);
});

gulp.task('zip', ['clean', 'build'], function() {
  var manifest = require('./src/manifest');
  var filename = manifest.name + ' v' + manifest.version + '.zip';

  return gulp.src('build/**')
  .pipe(zip(filename))
  .pipe(gulp.dest('dist'));
});

//run all tasks after build directory has been cleaned
gulp.task('default', ['watch']);