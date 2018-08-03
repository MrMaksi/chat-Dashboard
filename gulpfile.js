'use strict';

let gulp = require('gulp'),
    fs = require("fs"),
    autoprefixer = require('autoprefixer'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    csso = require('gulp-csso'),
    htmlhint = require("gulp-htmlhint"),
    plumber = require('gulp-plumber'),
    postcss = require('gulp-postcss'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    svgmin = require('gulp-svgmin');
;

gulp.task('scss', function() {
    let processors = [
        autoprefixer({browsers: ['last 3 version', 'ie 10']})
    ];

    gulp.src('./assets/style/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(processors))
        .pipe(csso())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./assets/style/'))
        .pipe(browserSync.stream());
});

gulp.task('htmlhint', function() {
    gulp.src("*.html")
        .pipe(htmlhint({
            "tag-pair": true,
            "style-disabled": true,
            "img-alt-require": true,
            "tagname-lowercase": true,
            "src-not-empty": true,
            "id-unique": true,
            "attr-lowercase": false,
            "spec-char-escape": true
        }))
        .pipe(htmlhint.reporter());
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: './'
        },
        port: 8080,
        open: false,
        notify: false
    });
    gulp.watch("*.html").on("change", reload);
});

gulp.task('watch', ['browser-sync', 'htmlhint'], function() {
    gulp.watch('./assets/style/**/*.scss', ['scss']);
    gulp.watch('./*.html');
});

gulp.task('default', ['scss', 'prepareJs']);

gulp.task('svgo', function() {
    return gulp.src('./assets/images/svg/*.svg')
        .pipe(svgmin({
            js2svg: {
                pretty: true
            },
            plugins: [{
                removeDoctype: false
            }, {
                removeXMLProcInst: true
            }, {
                removeComments: true
            }, {
                removeMetadata: true
            }, {
                removeEditorsNSData: true
            }, {
                removeEmptyAttrs: true
            }, {
                removeHiddenElems: true
            }, {
                removeEmptyText: true
            }, {
                removeEmptyContainers: true
            }, {
                cleanupIDs: true
            }, {
                minifyStyles: true
            }, {
                collapseGroups: true
            }, {
                sortAttrs: true
            }, {
                removeUnusedNS: true
            }, {
                cleanupNumericValues: {
                    floatPrecision: 2
                }
            }, {
                convertColors: {
                    names2hex: false,
                    rgb2hex: false
                }
            }]
        }))
        .pipe(gulp.dest('./assets/images/svg'));
});
