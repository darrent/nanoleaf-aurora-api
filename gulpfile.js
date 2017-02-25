var gulp = require('gulp'),
  jsHint = require('gulp-jshint'),
  jscs = require('gulp-jscs'),
  mocha = require('gulp-mocha'),
  util = require('gulp-util');

var jsFiles = ['*.js', 'lib/**/*.js', 'tests/**/*.js'];

gulp.task('style', function() {
  return gulp.src(jsFiles)
    .pipe(jsHint())
    .pipe(jsHint.reporter('jshint-stylish', {
      verbose: true
    }))
    .pipe(jscs());
});

gulp.task('test', function(jsTestFiles) {
  return gulp.src(jsFiles, {
      read: false
    })
    .pipe(mocha({
      reporter: 'spec'
    }))
    .on('error', util.log);
});

gulp.task('watch', function() {
  gulp.watch(jsFiles, ['test']);
});

gulp.task('default', ['style', 'test']);