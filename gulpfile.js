/*!
 * gulp
 * $ npm install gulp-autoprefixer gulp-minify-css gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-notify gulp-rename gulp-livereload gulp-cache del gulp-html-replace gulp-connect --save-dev
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
    connect = require('gulp-connect');


// Our task config
var runList = [
    'styles',
//    'images',
    'scripts',
    'html'
];
var createStream = function(){
    // Actually nothing needed here, this function just required to create stream "on('data')"
}
var taskFunctions = {
    styles: function () {
        return new Promise(function (resolve, reject) {
            gulp.src('src/styles/**/*.css')
                .pipe(autoprefixer('last 2 version'))
                .pipe(gulp.dest('dist/styles'))
                .pipe(rename({ suffix: '.min' }))
                .pipe(minifycss())
                .pipe(gulp.dest('dist/styles'))
                .pipe(notify({ message: 'Styles task complete' }))
                .on('data', createStream)
                .on('end', resolve)
                .on('error', reject);
        });
    },
    scripts: function () {
        return new Promise(function (resolve, reject) {
            gulp.src(['src/scripts/utils/*.js', 'src/scripts/*.js'])
                .pipe(jshint('.jshintrc'))
                .pipe(jshint.reporter('default'))
                .pipe(concat('all.js'))
                .pipe(gulp.dest('dist/scripts'))
                .pipe(rename({ suffix: '.min' }))
//                .pipe(uglify())
                .pipe(gulp.dest('dist/scripts'))
                .pipe(notify({ message: 'Scripts task complete' }))
                .on('data', createStream)
                .on('end', resolve)
                .on('error', reject);
        });
    },
    images: function(){
        return new Promise(function(resolve, reject) {
            gulp.src('src/images/**/*')
                .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
                .pipe(gulp.dest('dist/images'))
                .pipe(notify({ message: 'Images task complete' }))
                .on('data', createStream)
                .on('end', resolve)
                .on('error', reject);
        });
    },
    html: function(){
        return new Promise(function(resolve, reject) {
            gulp.src('src/*.html')
                .pipe(htmlreplace({
    //            'css': 'styles.min.css',
                    'js': 'scripts/all.min.js'
                }))
                .pipe(gulp.dest('dist'))
                .pipe(notify({message: 'HTML task complete'}))
                .on('data', createStream)
                .on('end', resolve)
                .on('error', reject);
        });
    }
}


// Create our gulp tasks
function createGulpTask(taskName, taskFunction){
    gulp.task(taskName, function(){
        return taskFunction();
    })
}
for(var i in taskFunctions){
    createGulpTask(i, taskFunctions[i]);
}

// Clean task
gulp.task('clean', function(cb) {
    return del(['dist/*'], cb)
});

// Build task
gulp.task('build', function(){
    // Promises
    var promiseList = [];
    // Run the tasks listed in variable "runList"
    for(var i = 0; !!runList && i < runList.length; i++){
        promiseList[promiseList.length] = taskFunctions[runList[i]]();
        console.info((i+1) + ' of ' + runList.length + ' tasks started');
    }

    // When all tasks completed
    Promise.all(promiseList).then(function(){
        console.info('All build tasks complete');
    });
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
    livereload.listen();  // This livereload is for when "node server.js" is run.

    // Watch any files in dist/, reload on change
    gulp.watch(['dist/**']).on('change', livereload.changed);

});

// Test - dependency on build and watch
// Alternative is to run "node server.js"
gulp.task('serve', ['build', 'watch'], function(){
    connect.server({
        livereload: true, // This livereload is for when "gulp serve" is run.
        root: 'dist',
        port: 3000
    });
});
