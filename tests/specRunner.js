(function()
{
	'use strict';

	require.config({
		baseUrl: "../src",
		paths:
		{
			'jasmine': '../lib/jasmine/jasmine',
			'jasmine-html': '../lib/jasmine/jasmine-html',
			'boot': '../lib/jasmine/boot'
		},
		shim:
		{
			'jasmine': {
				exports: 'window.jasmineRequire'
			},
			'jasmine-html': {
				deps: ['jasmine'],
				exports: 'window.jasmineRequire'
			},
			'boot': {
				deps: ['jasmine', 'jasmine-html'],
				exports: 'window.jasmineRequire'
			}
		}
	});


	require(['boot'], function(jasmine)
	{
		var testRootPath = '../tests/specs/',
			specs = [];

		specs.push(testRootPath + 'grammar');
		specs.push(testRootPath + 'lexer');

		require(specs, function (spec) {
			window.onload();
		});
	});
})();