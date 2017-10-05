var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer'),
shell = require("gulp-shell"),
imagemin = require('gulp-imagemin'),
concat = require('gulp-concat'),
del = require('del'),
inject = require('gulp-inject'),
filter = require("gulp-filter"),
merge = require("merge-stream"),
mainBowerFiles = require("main-bower-files");

gulp.task("serve", ["watch"], shell.task("node server.js"));

gulp.task('watch', ["build"], function() {

    gulp.watch(["./src/**/*.*", "./server/**/*.*"], ["build"]);

});

gulp.task('styles', function() {
	return gulp.src('src/assets/css/**/*.css', { style: 'expanded' })
	.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
	// .pipe(concat("styles.css"))
	// .pipe(rename({suffix: '.min'}))
	// .pipe(uglify())
	.pipe(gulp.dest('dist/assets/css'));
});

gulp.task('scripts', ['vendor'], function() {
	return gulp.src([])
	// .pipe(jshint('.jshintrc'))
	// .pipe(jshint.reporter('default'))
	.pipe(concat('main.js'))
	// .pipe(rename({suffix: '.min'}))
	// .pipe(uglify())
	.pipe(gulp.dest('dist/assets/js'));
});

gulp.task("vendor", function () {

	var bower_comp = __dirname + "/bower_components";
    var glob = [bower_comp + '/jquery/jquery.js'].concat(mainBowerFiles(['**/*.js', '!' + bower_comp + '/jquery/jquery.js']));

    var js = gulp.src(glob, { base: bower_comp })
	.pipe(filter("**/*.js"))
	.pipe(concat("vendor.js"))
	.pipe(gulp.dest("dist/assets/js"));

	var css = gulp.src(mainBowerFiles())
	.pipe(filter("**/*.css"))
	.pipe(concat("vendor.css"))
	// .pipe(rename({suffix: '.min'}))
	// .pipe(uglify())
	.pipe(gulp.dest("dist/assets/css"));

	return merge(js, css);
});

gulp.task("html", function () {

	return gulp.src('src/assets/**/*.html')
	.pipe(gulp.dest("dist/assets/"))
});

gulp.task('images', function() {
	return gulp.src('src/assets/img/**/*')
	.pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
	.pipe(gulp.dest('dist/assets/img'));
});

gulp.task('fonts', function () {

	return gulp.src("src/assets/css/**/*.*")
	.pipe(gulp.dest("dist/assets/css"))
});

gulp.task("misc", function () {

	return gulp.src(["./favicon.ico"])
	.pipe(gulp.dest("dist"));
})

gulp.task('index', ["vendor", "styles", 'html', "fonts", "images", "misc"], function () {

	// It's not necessary to read the files (will speed up things), we're only after their paths: 
	var important = gulp.src('dist/assets/js/vendor.js', {read: false});
	var standard = gulp.src(['dist/assets/**/*.css'], {read:false});

	return gulp.src('src/index.html')
	.pipe(inject(important, {ignorePath:"dist", starttag: '<!-- inject:head:{{ext}} -->'}))
	.pipe(inject(standard, {ignorePath:"dist"}))
	.pipe(gulp.dest('dist'));
});

gulp.task('clean', function() {
	return del('dist');
});

gulp.task('build', ['clean'], function() {
	gulp.start("index");
});






