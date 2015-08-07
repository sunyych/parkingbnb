//LINES 2 THROUGH 10 IMPORTS ALL OF THE GULP MODULES//
var gulp = require('gulp');
var	sass = require('gulp-ruby-sass');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var minifycss = require('gulp-minify-css');
var notify = require('gulp-notify');
var livereload = require('gulp-livereload');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('styles',function(){ //line 12 is a function that activates when the event listner is activated on line 38.
	return sass('public/sass',{style:'expanded'}) //line 13 specifies the style of the sass?.
	.pipe(autoprefixer('last 2 versions'))//line 14 specifies the version of browsers to accept
	.pipe(gulp.dest('public/css'))//line 15 says to go to the public/css file
	.pipe(rename({suffix:".min"}))//line 16 says to add ".min" to the duplicate file being made.
	.pipe(minifycss())//line 17 says to minify the file.
	.pipe(gulp.dest('public/css'))//line 18 says to place the new minified file into public/css.
	.pipe(notify({message:'SCSS Compiled'}));//line 19 says to send the message to the server upon completion.

});

gulp.task('scripts', function(){ //line 23 is a function that activates when the event listner is activated on line 40.
	return gulp.src("public/javascript/**")//line 24 says to connect to all the js files in public/javascript
	.pipe(concat('jsBundle.js')) //line 25 is a method that pushes all js files into jsBundle.js through databinding.
	.pipe(gulp.dest('public/bundles')) //line 26 says to go to the public/bundles folder.
	.pipe(rename({suffix:".min"}))// line 27 says to add '.min' to the end of the duplicate file.
	.pipe(uglify()) //line 28 says to uglify the file (similar to minifying, not %100 the same).
	.pipe(gulp.dest('public/bundles')) //line 29 says to place the new duplicate file in the public/bundles.
	.pipe(notify({message:"Minified JS, and Bundled"})); //line 30 says to send this message to the server.
});
gulp.task('watch', function(){ //line 32 is an event listner that is activated when an event is triggered.
	livereload.listen(); //line 33 is an event that causes a livereload on line 36.
	//line 30 says that any file that is changed and saved in the public folder(server side) or views(client side) 
	//to reload the server & browser automatically!
	gulp.watch(['public/**', 'views/*']).on('change',livereload.changed);
	//on line 35 says if there is any changes made to those directories, then the "styles" task is activated.
	gulp.watch('public/sass/*.scss',['styles']);
	//on line 35 says if there is any changes made to those directories, then the "scripts" task is activated.
	gulp.watch('public/javascript/**',['scripts']);

});