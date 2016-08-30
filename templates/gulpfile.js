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
// var myTestKB = ""; // C:/KBs/TestKb/CSharp/web/MyUC
var gxconfig = {gxtestkb: ""};

var cfile = path.join(__dirname, "config.json");
console.log(cfile);

if (fs.existsSync(cfile) ){
	var data = JSON.parse(fs.readFileSync( cfile, 'utf8'));
	if (data.gxtestkb)
		gxconfig.gxtestkb = path.join( data.gxtestkb, util.env.ucname);
}

gulp.task('debug', function(cb) {
	runSequence('clean', ['copyall', 'copyalltest']);
});

gulp.task('release', function(cb) {
	runSequence('clean', ['copypart','uglify','styles']);
});

// Update Test KB
gulp.task('copyalltest', function() {
	if (gxconfig.gxtestkb){
		console.log(`TestKB: ${gxconfig.gxtestkb}`);

		if (!isDirectorySync(gxconfig.gxtestkb)){
			try{
				fs.mkdirSync(gxconfig.gxtestkb);
			}
			catch(ex){
				console.log("TestKB path can't be created");
			}
		}

		if (isDirectorySync(gxconfig.gxtestkb)){
	   	gulp.src('src/**/*')
	   	.pipe(gulp.dest(gxconfig.gxtestkb));
		}

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
