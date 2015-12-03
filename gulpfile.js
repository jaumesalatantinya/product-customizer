'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var browserSync = require('browser-sync');
var ftp = require('vinyl-ftp');
var Server = require('karma').Server;

var wFiles = ['./**/*.php', './product-customizer/**/*.css', './product-customizer/**/*.js'];

gulp.task('serve', function() {
    browserSync.init({
        proxy: "http://www.sellosyrotulos.com/"
    });
});

gulp.task('rbs', ['ftp'], function() {
    browserSync.reload();
});

gulp.task('ftp', function() {
    var conn = ftp.create( {
        host:     'www.sellosyrotulos.com',
        user:     'sellosyrotulos.com',
        password: 'wwwSEL15',
        parallel: 10,
        log:      gutil.log
    } );
    var globs = wFiles;
    return gulp.src( globs, { base: '.', buffer: false } )
        .pipe( conn.newerOrDifferentSize( '/html/webmaster/' ) ) 
        .pipe( conn.dest( '/html/webmaster/' ) );
});

gulp.task('watch', function() {
    gulp.watch(wFiles, ['ftp', 'rbs']);
});

gulp.task('tdd', function() {
});

gulp.task('default', ['watch', 'serve', 'tdd']);
