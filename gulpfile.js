
"use strict";

var jshint = require('gulp-jshint');
var watchify = require('watchify');
var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var assign = require('lodash.assign');
var sass = require('gulp-sass');


// add custom browserify options here
var customOpts = {
entries: ['./javascripts/main.js'],
debug: true
};
var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts));

gulp.task('bundle', bundle); // changed from the sample gulpfile. Was 'default'

gulp.task('default', ['bundle', 'lint', 'watch', 'sassify']); //add test?

gulp.task('lint', function() {
return gulp.src('./javascripts/**/*.js')
.pipe(jshint())
.pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('sassify', function () {
  return gulp.src('./sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});

gulp.task('watch', function() {
gulp.watch(['./javascripts/**/*.js'], ['lint', 'bundle']);
gulp.watch('./sass/**/*.scss', ['sassify']);
});

// Makes watch keep watching even on JS error. Need to learn about gutil
var onError = function ( err ) {
gutil.log( gutil.colors.green( err.message ) );
this.emit( 'end' );
};

function bundle() {
return b.bundle()
// log errors if they happen
.on('error', gutil.log.bind(gutil, 'Browserify Error'))
.pipe(source('bundle.js'))
.pipe(gulp.dest('./dist'));
}