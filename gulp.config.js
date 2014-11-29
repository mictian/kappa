
var javascript_files = ['__prologue__.js',
        'utils/obj.js'
    ,   'utils/str.js'
    ,   'data/node.js'
    ,   'data/grammar.js'
    ,   'data/astNode.js'
    ,   'data/itemRule.js'
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
,   all_files = []
,   spec_files = [
        'data/specASTNode.js'
    ,   'data/specAutomata.js'
    ,   'data/specGrammar.js'
    ,   'data/specItemRule.js'
    ,   'data/specNode.js'
    ,   'data/specStackItem.js'
    ,   'lexer/specLexer.js'
    ,   'data/specState.js'
    ,   'parser/specAutomataLRGeneratorBase.js'
    ,   'parser/specAutomataLR0Generator.js'
    ,   'parser/specAutomataLALR1Generator.js'
    ,   'parser/specConflictResolver.js'
    ,   'parser/specParser.js'
    ,   'utils/specObj.js'
    ,   'utils/specStr.js'
        ]
        .map(function (p) { return 'tests/specs/'+ p; })

    //FILE NAMES AND PATHS
,   package_name = 'kappa'
,   specs_container = 'specs.js'
,   package_file_name = package_name + '.js'
,   package_file_name_min = package_name + '.min.js'
,   output_path = './build';

spec_files.unshift('tests/sampleGrammars.js');
spec_files.unshift('tests/specRunner.js');

all_files = spec_files.concat(javascript_files);
all_files.unshift('./gulp.config.js');


module.exports = {
    specFiles: spec_files
,   javascriptFiles: javascript_files
,   packageName: package_name
,   specsContainer: specs_container
,   packageFileName: package_file_name
,   packageFileNameMin: package_file_name_min
,   outputPath: output_path
,   allFiles: all_files
};