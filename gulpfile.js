var gulp = require('gulp');
var atom = require('gulp-atom');
var browserify = require('browserify');
var eslint = require('gulp-eslint');
var sass = require('gulp-sass');
var runSequence = require('run-sequence');
var source = require('vinyl-source-stream');
var electron = require('electron-prebuilt');
var childProcess = require('child_process');

var srcPath = './src';
var distPath = './dist';
var compilePath = distPath + '/compile';
var releasePath = distPath + '/build';
var cachePath = distPath + '/cache';
var stylesPath = compilePath + '/styles';

gulp.task('default', function() {
  runSequence('watch', 'build', 'run');
});

gulp.task('compile', ['lint', 'browserify', 'through', 'sass']);

gulp.task('watch', ['compile'], function() {
  gulp.watch(srcPath + '/components/**/*', ['browserify']);
  gulp.watch(srcPath + '/styles/**/*', ['sass']);
  gulp.watch([
    srcPath + '/index.html',
    srcPath + '/index.js'
  ], ['through']);
  gulp.watch([
    compilePath + '/**/*',
    '!' + compilePath + '/node_modules/**/*'
  ], ['build']);
});

gulp.task('build', function() {
  return atom({
    srcPath: compilePath,
    releasePath: releasePath,
    cachePath: cachePath,
    version: 'v0.34.2',
    rebuild: false,
    platforms: ['darwin-x64'],
  });
});

gulp.task('run', function() {
  return childProcess.spawn(electron, [compilePath]);
});

gulp.task('browserify', function() {
  return browserify('./src/components/app.js')
    .transform('babelify', { presets: ['es2015', 'react'] })
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest(compilePath));
});

gulp.task('through', function() {
  return gulp.src([
      srcPath + '/index.html',
      srcPath + '/index.js',
      './init.js'
    ])
    .pipe(gulp.dest(compilePath));
});

gulp.task('sass', function() {
  return gulp.src(srcPath + '/styles/**/*.sass')
    .pipe(sass())
    .pipe(gulp.dest(stylesPath));
});

gulp.task('lint', function() {
  return gulp.src(['src/**/*.js', '*.js'], { base: './' })
    .pipe(eslint())
    .pipe(eslint.format());
});
