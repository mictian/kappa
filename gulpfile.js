/* jshint node: true */

var gulp = require('gulp')
,   concat = require('gulp-concat')
,   sourcemaps = require('gulp-sourcemaps')
,   uglify = require('gulp-uglify')
,   newer = require('gulp-newer')
,   jshint = require('gulp-jshint');

//CONFIGURATION
var javascript_files = ['__prologue__.js',
        'utils/obj.js'
    ,   'utils/str.js'
    ,   'data/node.js'
    ,   'data/grammar.js'
    ,   'data/astNode.js'
    ,   'data/itemRule.js'
    ,   'data/sampleGrammars.js'
    ,   'data/stackItem.js'
    ,   'data/state.js'
    ,   'data/automata.js'
    ,   'lexer/lexer.js'
    ,   'parser/automataLRGeneratorBase.js'
    ,   'parser/automataLR0Generator.js'
    ,   'parser/automataLALR1Generator.js'
    ,   'parser/conflictResolver.js'
    ,   'parser/parser.js'
    ,   '__epilogue__.js'
        ].map(function (p) { return 'src/'+ p; })
,   spec_files = [
        // 'data/specASTNode.js'
    // ,   'data/specAutomata.js'
    // ,   'data/specGrammar.js'
    // ,   'data/specItemRule.js'
    // ,   'data/specNode.js'
    // ,   'data/specStackItem.js'
    // ,   'lexer/specLexer.js'
       'data/specState.js'
    ,   'parser/specAutomataLALR1Generator.js'
    ,   'parser/specAutomataLR0Generator.js'
    ,   'parser/specAutomataLRGeneratorBase.js'
    // ,   'parser/specParser.js'
    // ,   'utils/specObj.js'
    // ,   'utils/specStr.js'
        ]
        .map(function (p) { return 'tests/specs/'+ p; })
    //FILE NAMES AND PATHS
,   package_name = 'kappa'
,   specs_container = 'specs.js'
,   package_file_name = package_name + '.js'
,   package_file_name_min = package_name + '.min.js'
,   output_path = './build';

spec_files.unshift('tests/specRunner.js');


//TASKS DEFINITION
gulp.task('build-concat', function ()
{
    return gulp.src(javascript_files)
        .pipe(newer(output_path +'/'+ package_file_name))
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(sourcemaps.init())
        .pipe(concat(package_file_name))
		.pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(output_path));
});

gulp.task('build', function ()
{
    return gulp.src(javascript_files)
        .pipe(concat(package_file_name_min))
        .pipe(jshint())
        .pipe(sourcemaps.init())
        .pipe(uglify())
		.pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(output_path));
});

gulp.task('gen-tests', function ()
{
    return gulp.src(spec_files)
        .pipe(newer(output_path +'/'+ specs_container))
        .pipe(concat(specs_container))
        .pipe(gulp.dest(output_path));
});

gulp.task('default', function ()
{
    gulp.watch(javascript_files.concat(spec_files), ['build-concat', 'gen-tests']);
})
