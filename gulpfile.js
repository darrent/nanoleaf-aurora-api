var gulp      = require('gulp'),
    jsHint    = require('gulp-jshint'),
    jscs      = require('gulp-jscs'),
    gulpMocha = require('gulp-mocha');

var jsFiles = ['*.js', 'lib/**/*.js'];

gulp.task('style', function() {
  return gulp.src(jsFiles)
    .pipe(jsHint())
    .pipe(jsHint.reporter('jshint-stylish', {
      verbose: true
    }))
    .pipe(jscs());
});

gulp.task('test', function(jsTestFiles) {
  gulp.src(jsFiles, {
      read: false
    })
    .pipe(gulpMocha());
});

gulp.task('watch', function() {
  gulp.watch(jsFiles, ['style', 'test']);
});

gulp.task('default', ['style', 'test']);