// Node
var fs = require('fs');
var path = require('path');

// Gulp libraries
var gulp = require('gulp');
var util = require('gulp-util');
var runSequence = require('run-sequence');
var clean = require('gulp-clean');
var plumber = require('gulp-plumber');
var uglify = require('gulp-uglify');
var minifycss = require('gulp-minify-css');

// Fill below var to update our testkb
var myTestKB = ""; // C:/KBs/TestKb/CSharp/web/MyUC

gulp.task('debug', function(cb) {
	runSequence('clean', ['copyall', 'copyalltest']);
});

gulp.task('release', function(cb) {
	runSequence('clean', ['copypart','uglify','styles']);
});

// Update Test KB
gulp.task('copyalltest', function() {
	if (isDirectorySync(myTestKB)){
   	gulp.src('src/**/*')
   	.pipe(gulp.dest(myTestKB));
	}else {
		console.log("No TestKB defined");
	}
});

gulp.task('clean', function() {
	gulp.src('build/'+util.env.target+'/**/*')
   .pipe(clean());
})

gulp.task('copyall', function() {
   gulp.src('src/**/*')
   .pipe(gulp.dest('build/'+util.env.target));
});

gulp.task('copypart', function() {
   gulp.src(['src/**/*','!src/**/*.js','!src/**/*.css'])
   .pipe(gulp.dest('build/'+util.env.target));
});

gulp.task('uglify', function(){
  return gulp.src('src/**/*.js')
	 .pipe(plumber({
		errorHandler: function (error) {
		  console.log(error.message);
		  this.emit('end');
	 }}))
	 .pipe(uglify())
	 .pipe(gulp.dest('build/'+util.env.target))
});

gulp.task('styles', function(){
  gulp.src(['src/**/*.css'])
	 .pipe(plumber({
		errorHandler: function (error) {
		  console.log(error.message);
		  this.emit('end');
	 }}))
	 .pipe(minifycss())
	 .pipe(gulp.dest('build/'+util.env.target))
});

// ----------------------------------
// Useful functions
function isDirectorySync( path ){
	if (fs.existsSync(path) ){
		return fs.lstatSync(path).isDirectory();
	}
	return false;
}
