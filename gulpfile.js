
const {src, dest, parallel, series, watch} = require('gulp');
const htmlmin = require('gulp-htmlmin');
const babel = require('gulp-babel');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const browserSync = require('browser-sync');

function moveHTML() {
    return src('index.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest('build'))
    .pipe(browserSync.reload({
        stream: true
    }))
}

function buildJS() {
    return src('assets/js/*.js')
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(dest('build/js'))
    .pipe(browserSync.reload({
        stream: true
    }));
}

function buildCSS() {
    return src('assets/style/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(concat('styles.css'))
    .pipe(dest('build/css'))
    .pipe(browserSync.reload({
        stream: true
    }))
}

function launchBrowser(params) {
    browserSync.init({
        server: 'build/'
    });
    watch('assets/style/*.scss', buildCSS);
    watch('index.html', moveHTML);
    watch('assets/js/script.js', buildJS)
}
exports.default = series(parallel(moveHTML, buildJS, buildCSS), launchBrowser);