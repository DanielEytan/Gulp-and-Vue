var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('watch', ['browserSync', 'sass'], function(){
  gulp.watch('src/sass/**/*.scss', ['sass']);
  // Reloads the browser whenever HTML or JS files change
  gulp.watch('src/*.html', browserSync.reload); 
  gulp.watch('src/js/**/*.js', ['useref']); 
});

gulp.task('sass', function(){
  return gulp.src('src/sass/**/*.scss')
    .pipe(sass()) // Using gulp-sass
    .pipe(gulp.dest('html/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'html'
    },
  })
});

gulp.task('useref', function(){
  return gulp.src('src/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    // Minifies only if it's a CSS file
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('html'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('images', function(){
  return gulp.src('src/images/**/*.+(png|jpg|gif|svg)')
  .pipe(cache(imagemin({
      interlaced: true
    })))
  .pipe(gulp.dest('html/images'))
});

gulp.task('fonts', function() {
  return gulp.src('src/fonts/**/*')
  .pipe(gulp.dest('html/fonts'))
});

gulp.task('clean:html', function() {
  return del.sync('html');
});

gulp.task('task-name', function(callback) {
  runSequence('task-one', ['tasks','two','run','in','parallel'], 'task-three', callback);
});

gulp.task('build', function (callback) {
  runSequence('clean:html', 
    ['sass', 'useref', 'images', 'fonts'],
    callback
  )
});

gulp.task('autoprefixer', () =>
    gulp.src('src/styles.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('html/css'))
);

gulp.task('default', function (callback) {
  runSequence(['sass','browserSync', 'watch', 'useref', 'autoprefixer'],
    callback
  )
});
