/*
gulpfile.js for aceunion-html-package 1.0.0
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
var plumber      = require('gulp-plumber');
var runSequence  = require('run-sequence');
var sass         = require('gulp-sass');
var saveLicense  = require('uglify-save-license');
var sourcemaps   = require('gulp-sourcemaps');
var stylish      = require('jshint-stylish');
var uglify       = require('gulp-uglify');


gulp.task('cssplugin', function() {
	return gulp.src(['project/resources/css/*.css', '!project/resources/css/style.css']) // 読込み元ファイル
		.pipe(plumber())
		.pipe(autoprefixer({
			browsers: ['last 2 version', 'ie 8', 'ie 9']
		}))
		.pipe(concat('plugins.css'))
		.pipe(cmq({
			log: true
		}))
		.pipe(csso())
		.pipe(gulp.dest('project/css')) // compressed書き出し先
		.pipe(browserSync.reload({
			stream: true
		}));
});


gulp.task('cssdev-primary', function() {
	return gulp.src('project/resources/sass/*.scss') // 読込み元ファイル
		.pipe(plumber())
		.pipe(sourcemaps.init())
			.pipe(sass({
				// indentedSyntax: true
			}))
			.pipe(autoprefixer({
				browsers: ['last 2 version', 'ie 8', 'ie 9']
			}))
		.pipe(sourcemaps.write('../../'))
		.pipe(gulp.dest('project/resources/css')); // expanded書き出し先
});

gulp.task('cssdev-secondary', function() {
	return gulp.src('project/resources/css/style.css') // 読込み元ファイル
		.pipe(plumber())
		.pipe(concat('style.css'))
		.pipe(cmq({
			log: true
		}))
		.pipe(csso())
		.pipe(gulp.dest('project')); // compressed書き出し先
});

gulp.task('cssdev', function(callback) {
	runSequence('cssdev-primary', 'cssdev-secondary', 'bs-reload' ,callback);
});


gulp.task('jsplugin', function() {
	return gulp.src(['project/resources/plugins/*.js','project/resources/js/plugins.js'])
		.pipe(plumber())
		.pipe(concat('script.js'))
		.pipe(uglify({
			preserveComments: saveLicense
		}))
		.pipe(gulp.dest('project/js'))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('jsdev', function() {
	return gulp.src('project/resources/js/setting.js')
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
		.pipe(gulp.dest('project/images'));
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
	gulp.watch('project/resources/css/*.css', ['cssplugin']);
	gulp.watch('project/resources/sass/*.scss', ['cssdev']);
	gulp.watch('project/resources/js/plugins.js', ['jsplugin']);
	gulp.watch('project/resources/js/setting.js', ['jsdev']);
	gulp.watch('project/resources/raw-images/*', ['images']);
	gulp.watch('project/*.html', ['htmlhint', 'bs-reload']);
});



gulp.task('dev', ['images', 'cssplugin', 'cssdev', 'jsplugin', 'jsdev']);
gulp.task('default', ['browser-sync', 'htmlhint', 'lint', 'dev', 'watch']);
