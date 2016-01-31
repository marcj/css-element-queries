var gulp = require('gulp');
var watch = require('gulp-watch');
var scss = require('gulp-scss');
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
            'css/*.scss'
        ])
        .pipe(scss())
        .pipe(gulp.dest('build/css'));
});

gulp.task('app', function () {
    gulp.src('node_modules/bootstrap/dist/css/bootstrap.min.css').pipe(gulp.dest('build/css/'));
});

gulp.task('js', function () {
    gulp.src([
            'node_modules/jquery/dist/jquery.min.js',
            'node_modules/bootstrap/dist/js/bootstrap.min.js',
            './app.js'
        ])
        .pipe(browserify({
            insertGlobals : true
        }))
        .pipe(concat('app.js'))
        .pipe(gulp.dest('build/js/'));

});

gulp.task('default', ['app', 'scss', 'js', 'watch']);