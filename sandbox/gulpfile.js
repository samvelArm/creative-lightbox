var gulp = require('gulp'),
	  less = require('gulp-less'),
    minifyCss = require('gulp-minify-css'),
    gutil = require('gulp-util'),
    concat = require('gulp-concat');

gulp.task('default', ['lesstocss', 'watch']);

gulp.task('watch', function() {
  gulp.watch('css/*.less', ['lesstocss']);
});


gulp.task('lesstocss', function() {
  return gulp.src('css/*.less')
    .pipe(less().on('error', function(err) {
      gutil.log(err);
      this.emit('end');
    }))
    .pipe(concat('creative-lightbox.css'))
    .pipe(gulp.dest('css/'))
});

gulp.task('lesstocssmin', function() {
  return gulp.src('css/*.less')
    .pipe(less())
    .pipe(concat('creative-lightbox.css'))
    .pipe(minifyCss())
    .pipe(gulp.dest('css/'))    
});
