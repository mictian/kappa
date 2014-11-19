/* jshint node: true */
var gulp = require('gulp')
,   concat = require('gulp-concat')
,   sourcemaps = require('gulp-sourcemaps')
,   uglify = require('gulp-uglify')
,   newer = require('gulp-newer')
,   jshint = require('gulp-jshint')
,   config = require('./gulp.config.js')
,   del = require('del');


//TASKS DEFINITION
gulp.task('clean', function (cb)
{
    del([config.outputPath + '/*'], cb);
});

gulp.task('build-concat', ['clean'], function ()
{
    config = require('./gulp.config.js');

    return gulp.src(config.javascriptFiles)
        .pipe(newer(config.outputPath +'/'+ config.packageFileName))
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(sourcemaps.init())
        .pipe(concat(config.packageFileName))
		.pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(config.outputPath));
});

gulp.task('build', ['clean'], function ()
{
    return gulp.src(config.javascriptFiles)
        .pipe(concat(config.packageFileNameMin))
        .pipe(jshint())
        .pipe(sourcemaps.init())
        .pipe(uglify())
		.pipe(sourcemaps.write('./'))
		//ADD TESTS HERE TOO!
        .pipe(gulp.dest(config.outputPath));
});

gulp.task('gen-tests', ['clean'], function ()
{
    config = require('./gulp.config.js');

    return gulp.src(config.specFiles)
        .pipe(newer(config.outputPath +'/'+ config.specsContainer))
        .pipe(concat(config.specsContainer))
        .pipe(gulp.dest(config.outputPath));
});

gulp.task('default', ['build-concat', 'gen-tests'], function ()
{
    gulp.watch(config.allFiles, ['build-concat', 'gen-tests']);
});
