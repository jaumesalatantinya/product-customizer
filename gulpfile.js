'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var browserSync = require('browser-sync');
var ftp = require('vinyl-ftp');
var Server = require('karma').Server;
var sass = require('gulp-sass');
var jshint = require('gulp-jshint');

var wFiles = ['./**/*.php', './product-customizer/**/*.html', './product-customizer/**/*.css', './product-customizer/**/*.js', './product-customizer/**/*.png', '!./product-customizer/vendor/**/*.*'];
var jsFiles = ['./product-customizer/product-customizer.js', './product-customizer/view.js' , './product-customizer/custom-elements.js'];
var ftpCred = {
    host:     'www.sellosyrotulos.com',
    user:     'sellosyrotulos.com',
    password: '',
    parallel: 50,
    log:      gutil.log
};



gulp.task('serve', function() {
    browserSync.init({
        proxy: "http://www.sellosyrotulos.com/"
    });
});

gulp.task('rbs', ['ftp'], function() {
    browserSync.reload();
});

gulp.task('ftp', ['cleanFtp'], function(cb) {
    var conn = ftp.create(ftpCred);
    var globs = wFiles;
    return gulp.src( globs, { base: '.', buffer: false } )
        .pipe( conn.newerOrDifferentSize( '/html/' ) ) 
        .pipe( conn.dest( '/html/' ) );
});

gulp.task('cleanFtp', function(cb) {
  var conn = ftp.create( ftpCred );
  conn.delete( '/html/product-customizer/styles.css', cb );
});

gulp.task('sass', function () {
  gulp.src('./product-customizer/styles.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./product-customizer/'));
});

gulp.task('watch', function() {
    gulp.watch(jsFiles, ['jshint']);
    gulp.watch(wFiles, ['ftp', 'rbs']);
    gulp.watch('./product-customizer/styles.scss', ['sass', 'ftp', 'rbs']);
});

gulp.task('tdd', function(done) {
    new Server({
    configFile: __dirname + '/karma.conf.js'
    }, done).start();
});

gulp.task('jshint', function() {
    return gulp.src(jsFiles)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('default', ['watch', 'serve', 'sass', 'jshint']);
