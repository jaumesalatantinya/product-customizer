'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var browserSync = require('browser-sync');
var ftp = require('vinyl-ftp');
var ts = require('gulp-typescript');
// var sass = require('gulp-sass');
// var Server = require('karma').Server;
// var jshint = require('gulp-jshint');

var wFiles = ['./**/*.php', './product-customizer/**/*.css', './product-customizer/**/*.js'];

gulp.task('serve', function() {
    browserSync.init({
        proxy: "http://www.sellosyrotulos.com/"
    });
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

gulp.task('rbs', ['ftp'], function() {
    browserSync.reload();
});

// gulp.task('typescript', function () {
//     return gulp.src('product-customizer/**/*.ts')
//         .pipe( ts({
//             noImplicitAny: true,
//             out: 'output.js'
//         }));
//         // .pipe(gulp.dest('built/local'));
// });

gulp.task('typescript', function() {
    console.log('Compiling typescript');
    return gulp.src('./product-customizer/**/*.ts')
        .pipe(ts({module: 'commonjs'}))
        .js
        .pipe(gulp.dest('./product-customizer/'))
});

// gulp.task('sass', function () {
//   gulp.src('./product-customizer/app.scss')
//     .pipe(sass().on('error', sass.logError))
//     .pipe(gulp.dest('./product-customizer/'));
// });

// gulp.task('tdd', function (done) {
//   new Server({
//     configFile: __dirname + '/karma.conf.js'
//   }, done).start();
// });

// gulp.task('jshint', function () {
//     gulp.src(['./product-customizer/**.*js'])
//         .pipe(jshint('.jshintrc'))
//         .pipe(jshint.reporter('jshint-stylish'));
// });

gulp.task('watch', function() {
    gulp.watch(wFiles, ['ftp', 'rbs']);
    gulp.watch('./product-customizer/**/*.ts', ['typescript']);
    // gulp.watch(wFiles, {cwd: './'}, browserSync.reload);
    // gulp.watch('./product-customizer/**/*.scss', ['sass']);
    // gulp.watch('./product-customizer/**/*.js', ['jshint']);
});

gulp.task('default', ['watch', 'serve']);
