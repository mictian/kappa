/* jshint node: true */
var gulp = require('gulp')
,   concat = require('gulp-concat')
,   sourcemaps = require('gulp-sourcemaps')
,   uglify = require('gulp-uglify')
,   newer = require('gulp-newer')
,   jshint = require('gulp-jshint')
,   config = require('./gulp.config.js')
,   unzip = require('gulp-unzip')
,   rename = require('gulp-rename')
,   shell = require('gulp-shell')
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



gulp.task('install-jasmine', ['install-bower'], function ()
{
    var jasmine_path = 'bower_components/jasmine/dist/jasmine-standalone-2.0.0.zip';
    return gulp.src(jasmine_path)
        .pipe(unzip({
            filter : function(entry)
            {
                return !!(/lib\/jasmine.+\/.+/.test(entry.path));
            }
        }))
        .pipe(rename({
            dirname: '/lib/jasmine'
        }))
        .pipe(gulp.dest('.'));
});

gulp.task('install-bower', shell.task(['bower install']));