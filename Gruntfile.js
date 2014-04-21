module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		'bower-install-simple':
		{
			options:
			{
				production:  false,
				directory:   "bower_components"
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
		}
	});

	//Load tasks
	grunt.loadNpmTasks('grunt-zip');
	grunt.loadNpmTasks("grunt-bower-install-simple");


	grunt.task.registerTask('handleFiles', 'Manage Files and directories to just have the necessarry ones', function()
	{
		grunt.file.copy('bower_components/requirejs/require.js', 'lib/requirejs/require.js');
		grunt.file.delete('bower_components');
	});

	// Default task(s).
	grunt.registerTask('default', ['bower-install-simple', 'unzip', 'handleFiles']);

};