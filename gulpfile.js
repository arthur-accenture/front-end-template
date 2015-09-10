/*!
 * gulp
 * $ npm install gulp-autoprefixer gulp-minify-css gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-notify gulp-rename gulp-livereload gulp-cache del --save-dev
 */

// Load plugins
var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del'),
    htmlreplace = require('gulp-html-replace'),
    serve = require('gulp-serve');

// Styles
gulp.task('styles', function() {
    return gulp.src('src/styles/**/*.css')
        .pipe(autoprefixer('last 2 version'))
        .pipe(gulp.dest('dist/styles'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss())
        .pipe(gulp.dest('dist/styles'))
        .pipe(notify({ message: 'Styles task complete' }));
});

// Scripts
gulp.task('scripts', function() {
    return gulp.src('src/scripts/**/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist/scripts'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/scripts'))
        .pipe(notify({ message: 'Scripts task complete' }));
});

// Images
gulp.task('images', function() {
    return gulp.src('src/images/**/*')
        .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(gulp.dest('dist/images'))
        .pipe(notify({ message: 'Images task complete' }));
});

// HTML
gulp.task('html', function(){
    return gulp.src('src/*.html')
        .pipe(htmlreplace({
//            'css': 'styles.min.css',
            'js': 'scripts/main.min.js'
        }))
        .pipe(gulp.dest('dist'))
        .pipe(notify({message: 'HTML task complete'}));
});


// Clean
gulp.task('clean', function(cb) {
    return del(['dist/*'], cb)
});

// Build
gulp.task('build', function(){
    return gulp.start('styles', 'scripts', 'images', 'html');
});

// Default task
gulp.task('default', ['clean'], function() {
    gulp.start('build');
});

// Watch
gulp.task('watch', function() {
    // Watch .css files
    gulp.watch('src/styles/**/*.css', ['styles']);

    // Watch .js files
    gulp.watch('src/scripts/**/*.js', ['scripts']);

    // Watch image files
    gulp.watch('src/images/**/*', ['images']);

    // Watch html files
    gulp.watch('src/*.html', ['html']);

    // Create LiveReload server
    livereload.listen();

    // Watch any files in dist/, reload on change
    gulp.watch(['dist/**']).on('change', livereload.changed);

});

// Test - dependency on build and watch
gulp.task('test', ['build', 'watch'], function(){
    return serve('public');
});
