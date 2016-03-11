/*
gulpfile.js for aceunion-html-package 1.1.0
*/

var gulp         = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var browserSync  = require('browser-sync');
var changed      = require('gulp-changed');
var cmq          = require('gulp-combine-media-queries');
var concat       = require('gulp-concat');
var csso         = require('gulp-csso');
var htmlhint     = require("gulp-htmlhint");
var imagemin     = require('gulp-imagemin');
var jshint       = require('gulp-jshint');
var notify       = require('gulp-notify');
var plumber      = require('gulp-plumber');
var runSequence  = require('run-sequence');
var sass         = require('gulp-sass');
var saveLicense  = require('uglify-save-license');
var stylish      = require('jshint-stylish');
var uglify       = require('gulp-uglify');


gulp.task('cssdev-primary', function() {
  return gulp.src('project/resources/sass/*.scss')
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
      .pipe(sass().on('error', sass.logError))
      .pipe(autoprefixer({
        browsers: ['last 2 version', 'ie 9']
      }))
    .pipe(gulp.dest('project/resources/css')); // expanded書き出し先
});

gulp.task('cssdev-secondary', function() {
  return gulp.src('project/resources/css/style.css')
    .pipe(plumber())
    .pipe(concat('top.css'))
    .pipe(cmq({
      log: true
    }))
    .pipe(csso())
    .pipe(gulp.dest('project')); // compressed書き出し先
});

gulp.task('cssdev', function(callback) {
  runSequence('cssdev-primary', 'cssdev-secondary', 'bs-reload' ,callback);
});


gulp.task('jsdev', function() {
  return gulp.src('project/resources/js/*.js')
    .pipe(uglify({
      preserveComments: saveLicense
    }))
    .pipe(gulp.dest('project/js'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('lint', function() {
  return gulp.src('project/resources/js/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter(stylish));
});


gulp.task('images', function() {
  return gulp.src('project/resources/raw-images/*.+(jpg|jpeg|png|gif|svg)')
    .pipe(changed('project/images'))
    .pipe(imagemin({
      optimizationLevel: 7
    }))
    .pipe(gulp.dest('project/images'))
    .pipe(browserSync.reload({
      stream: true
    }));
});


gulp.task('htmlhint', function() {
  return gulp.src('project/*.html')
    .pipe(htmlhint('.htmlhintrc'))
    .pipe(htmlhint.reporter());
});


gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: 'project', // ルートディレクトリ
      index: 'index.html'
    },
    // tunnel: true,
    notify: true
  });
});


gulp.task('bs-reload', function() {
  browserSync.reload();
});


gulp.task('watch', function() {
  gulp.watch('project/resources/sass/*.scss', ['cssdev']);
  gulp.watch('project/resources/js/setting.js', ['jsdev']);
  gulp.watch('project/resources/raw-images/*.+(jpg|jpeg|png|gif|svg)', ['images']);
  gulp.watch('project/*.html', ['htmlhint', 'bs-reload']);
});


gulp.task('dev', ['images', 'cssdev', 'jsdev']);
gulp.task('default', ['browser-sync', 'htmlhint', 'lint', 'dev', 'watch']);
