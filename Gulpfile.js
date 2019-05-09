var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var browserify = require('gulp-browserify');

gulp.task('watch', function () {
    gulp.watch('css/*.scss', ['scss']);
    gulp.watch('app.js', ['js']);
    gulp.watch('*.html', ['app']);
});

gulp.task('scss', function () {
    return gulp.src([
            'css/*.scss',
            'node_modules/codemirror/lib/codemirror.css'
        ])
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(gulp.dest('build/css'));
});

gulp.task('app', function () {
    return gulp.src([
        './app.js'
    ])
        .pipe(browserify({
            insertGlobals : true
        }))
        .pipe(gulp.dest('build/js/'));
});

gulp.task('js', function () {
    return gulp.src([
            'node_modules/jquery/dist/jquery.min.js',
            'node_modules/bootstrap/dist/js/bootstrap.min.js',
            'build/js/app.js'
        ])
        .pipe(concat('app.js'))
        .pipe(gulp.dest('build/js/'));
});

gulp.task('build', gulp.series(['app', 'scss', 'js']));
