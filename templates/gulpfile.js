// Node
var fs = require("fs");
var path = require("path");

// Gulp libraries
var gulp = require("gulp");
var util = require("gulp-util");
var clean = require("gulp-clean");
var plumber = require("gulp-plumber");
var uglify = require("gulp-uglify");
var minifycss = require("gulp-minify-css");

// Fill below var to update our testkb
// var myTestKB = ""; // C:/KBs/TestKb/CSharp/web/MyUC
var gxconfig = { gxtestkb: "" };

var cfile = path.join(__dirname, "config.json");
console.log(cfile);

if (fs.existsSync(cfile)) {
  var data = JSON.parse(fs.readFileSync(cfile, "utf8"));
  if (data.gxtestkb)
    gxconfig.gxtestkb = path.join(data.gxtestkb, util.env.ucname);
}

gulp.task("clean", function() {
  return gulp.src("build/" + util.env.target + "/**/*").pipe(clean());
});

gulp.task("copyall", function() {
  return gulp.src("src/**/*").pipe(gulp.dest("build/" + util.env.target));
});

// Update Test KB
gulp.task("copyalltest", function(done) {
  if (gxconfig.gxtestkb) {
    console.log(`TestKB: ${gxconfig.gxtestkb}`);
    if (!isDirectorySync(gxconfig.gxtestkb)) {
      try {
        fs.mkdirSync(gxconfig.gxtestkb);
      } catch (ex) {
        console.log("TestKB path can't be created");
      }
    }
    if (isDirectorySync(gxconfig.gxtestkb)) {
      return gulp.src("src/**/*").pipe(gulp.dest(gxconfig.gxtestkb));
    }
  } else {
    console.log("No TestKB defined");
  }
  done();
});

gulp.task("copypart", function() {
  return gulp
    .src(["src/**/*", "!src/**/*.js", "!src/**/*.css"])
    .pipe(gulp.dest("build/" + util.env.target));
});

gulp.task("uglify", function() {
  return gulp
    .src("src/**/*.js")
    .pipe(
      plumber({
        errorHandler: function(error) {
          console.log(error.message);
          this.emit("end");
        }
      })
    )
    .pipe(uglify())
    .pipe(gulp.dest("build/" + util.env.target));
});

gulp.task("styles", function() {
  return gulp
    .src(["src/**/*.css"])
    .pipe(
      plumber({
        errorHandler: function(error) {
          console.log(error.message);
          this.emit("end");
        }
      })
    )
    .pipe(minifycss())
    .pipe(gulp.dest("build/" + util.env.target));
});

// ----------------------------------
// Useful functions
function isDirectorySync(path) {
  if (fs.existsSync(path)) {
    return fs.lstatSync(path).isDirectory();
  }
  return false;
}

gulp.task("debug", gulp.series("clean", "copyall", "copyalltest"));
gulp.task("release", gulp.series("clean", "copypart", "uglify", "styles"));
