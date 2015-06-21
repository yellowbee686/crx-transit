/**
 * jshint strict:true
 */

//npm install gulp gulp-minify-css gulp-uglify gulp-clean gulp-cleanhtml gulp-jshint gulp-strip-debug gulp-zip --save-dev

var gulp       = require('gulp');
var watch      = require('gulp-watch');
var clean      = require('gulp-clean');
var concat     = require('gulp-concat');
var coffee     = require('gulp-coffee');
var sass       = require('gulp-sass');
var cleanhtml  = require('gulp-cleanhtml');
var minifycss  = require('gulp-minify-css');
var jshint     = require('gulp-jshint');
var uglify     = require('gulp-uglify');
var zip        = require('gulp-zip');
var browserify = require('gulp-browserify');
var paths      = require('./paths');

gulp.task('clean', function() {
  return gulp.src('build/*', { read: false })
    .pipe(clean({ force: true }));
});

gulp.task('copy', function() {
  return gulp.src(paths.staticFiles, { base: 'src' })
    .pipe(gulp.dest('build'));
});

gulp.task('jshint', function() {
  return gulp.src(['Gulpfile.js', 'src/js/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('scripts', function() {
  var ignore = ['underscore', 'jquery', 'angular', 'angular-elastic'];

  gulp.src('src/js/lib/{lib-all,angular-all}.js')
    .pipe(browserify())
    .pipe(gulp.dest('./build/js/'));

  return gulp.src('src/js/*.js')
    .pipe(browserify({ignore: ignore}))
    .pipe(gulp.dest('./build/js/'));
});

gulp.task('styles', function() {
  return gulp.src(paths.styles)
    .pipe(sass())
    .pipe(gulp.dest('build/css'));
});

gulp.task('build', ['scripts', 'styles', 'copy']);

gulp.task('watch', ['build'], function() {
  gulp.watch(paths.static, ['copy']);
  gulp.watch(paths['js:app'], ['scripts']);
  gulp.watch(paths['js:page'], ['scripts']);
  gulp.watch(paths['js:trans'], ['scripts']);
  gulp.watch(paths['js:static'], ['scripts']);
  gulp.watch(paths.coffee, ['scripts']);
  gulp.watch(paths.styles, ['styles']);
});

gulp.task('zip', ['build'], function() {
  var manifest = require('./src/manifest');
  var filename = manifest.name + ' v' + manifest.version + '.zip';

  return gulp.src('build/**/*')
    .pipe(zip(filename))
    .pipe(gulp.dest('dist'));
});

//run all tasks after build directory has been cleaned
gulp.task('default', ['clean', 'build']);