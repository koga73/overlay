const gulp = require("gulp");
const sass = require("gulp-sass");

const sassSrc = "css/*.scss";
const cssDst = "css/";

gulp.task("sass", function(){
	return gulp
		.src(sassSrc)
		.pipe(sass({
			outputStyle:"compressed"
		})
		.on("error", function(ex){
		   console.log(ex);
		}))
		.pipe(gulp.dest(cssDst));
});

gulp.task("watch", function(){
	gulp.watch(sassSrc, ["sass"]);
});