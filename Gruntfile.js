/*global module: true */
module.exports = function(grunt) {
    'use strict';

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		'bower-install-simple':
		{
			options:
			{
				production:  false,
				directory:   'bower_components'
			}
		},
		'unzip':
		{
			// Skip/exclude files via `router`
			unzipCore:
			{
				router: function (filepath)
				{
					if (/lib\/jasmine.+\/.+/.test(filepath))
					{
						return filepath.substr( filepath.lastIndexOf('/'));
					}

					return null;
				},

				src: ['bower_components/jasmine/dist/jasmine-standalone-2.0.0.zip'],
				dest: 'lib/jasmine'
			}
		},
		jshint:
		{
			all: ['Gruntfile.js', 'src/**/*.js', 'src/*.js', 'tests/**/*.js'],
			options: {
				'-W040':true, //Remove "Possible Strict violation warning"
				'quotmark': 'single',
				'undef':true,
				'strict': true,
				'curly':  true,
				'eqeqeq': true,
				'freeze': true,
				'immed': true,
				'latedef': true,
				'newcap': true,
				'globals': {
                    'define': true,
                    'require': true
				}
			}
		},
		concat_sourcemap: { ////////////////////////////////////////////////////
			build: {
				src: ['__prologue__.js',
					'utils/obj.js', 'utils/str.js',
					'data/node.js', 'data/grammar.js', 'data/astNode.js', 'data/itemRule.js',
						'data/sampleGrammars.js', 'data/stackItem.js', 'data/state.js',
						'data/automata.js',
					'lexer/lexer.js',
					'parser/automataLRGeneratorBase.js', 'parser/automataLR0Generator.js',
						'parser/automataLALR1Generator.js', 'parser/conflictResolver.js',
						'parser/parser.js',
					'__epilogue__.js'
					].map(function (p) { return 'src2/'+ p; }),
				dest: 'build/<%= pkg.name %>.js',
				options: {
					separator: '\n\n'
				}
			},
		},
		uglify: { //////////////////////////////////////////////////////////////
			build: {
				src: 'build/<%= pkg.name %>.js',
				dest: 'build/<%= pkg.name %>.min.js',
				options: {
					banner: '//! <%= pkg.name %> <%= pkg.version %>\n',
					report: 'min',
					sourceMap: true,
					sourceMapIn: 'build/<%= pkg.name %>.js.map',
					sourceMapName: 'build/<%= pkg.name %>.min.js.map'
				}
			}
		}
	});

	//Load tasks
	grunt.loadNpmTasks('grunt-zip');
	grunt.loadNpmTasks('grunt-bower-install-simple');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-concat-sourcemap');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.task.registerTask('handleFiles', 'Manage Files and directories to just have the necessarry ones', function()
	{
		grunt.file.copy('bower_components/requirejs/require.js', 'lib/requirejs/require.js');
		grunt.file.delete('bower_components');
	});

	// Default task(s).
	grunt.registerTask('default', ['bower-install-simple', 'unzip', 'handleFiles']);
	grunt.registerTask('build2', ['concat_sourcemap', 'uglify']);
};