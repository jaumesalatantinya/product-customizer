'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var browserSync = require('browser-sync');
var ftp = require('vinyl-ftp');
var Server = require('karma').Server;
var sass = require('gulp-sass');

var wFiles = ['./**/*.php', './product-customizer/**/*.html', './product-customizer/**/*.css', './product-customizer/**/*.js', './product-customizer/**/*.png'];
var ftpCred = {
    host:     'www.sellosyrotulos.com',
    user:     'sellosyrotulos.com',
    password: 'wwwSEL15',
    parallel: 10,
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
        .pipe( conn.newerOrDifferentSize( '/html/webmaster/' ) ) 
        .pipe( conn.dest( '/html/webmaster/' ) );
});

gulp.task('cleanFtp', function(cb) {
  var conn = ftp.create( ftpCred );
  conn.delete( '/html/webmaster/product-customizer/styles.css', cb );
});

gulp.task('sass', function () {
  gulp.src('./product-customizer/styles.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./product-customizer/'));
});

gulp.task('watch', function() {
    gulp.watch(wFiles, ['ftp', 'rbs']);
    gulp.watch('./product-customizer/styles.scss', ['sass', 'ftp', 'rbs']);
});

gulp.task('tdd', function(done) {
    // new Server({
    // configFile: __dirname + '/karma.conf.js'
    // }, done).start();
});

gulp.task('default', ['watch', 'serve', 'tdd', 'sass']);
