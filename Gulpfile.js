var gulp = require('gulp');
var watch = require('gulp-watch');
var sass = require('gulp-sass');
var markdown = require('gulp-markdown');
var concat = require('gulp-concat');
var browserify = require('gulp-browserify');

gulp.task('markdown', function () {
    return gulp.src('markdown/*.md')
        .pipe(markdown())
        .pipe(gulp.dest('dist/'));
});

gulp.task('watch', function () {
    gulp.watch('css/*.scss', ['scss']);
    gulp.watch('app.js', ['js']);
    gulp.watch('markdown/*.md', ['markdown']);
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
});

gulp.task('js', function () {
    gulp.src([
            './app.js'
        ])
        .pipe(browserify({
            insertGlobals : true
        }))
        .pipe(gulp.dest('build/js/'));

    gulp.src([
            'node_modules/jquery/dist/jquery.min.js',
            'node_modules/bootstrap/dist/js/bootstrap.min.js',
            'build/js/app.js'
        ])
        .pipe(concat('app.js'))
        .pipe(gulp.dest('build/js/'));


});

gulp.task('default', ['app', 'scss', 'js', 'watch']);