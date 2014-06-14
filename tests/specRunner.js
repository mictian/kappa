/* global window: true, beforeEach: true */
(function()
{
	'use strict';

	require.config({
		baseUrl: '../src',
		paths:
		{
			'jasmine': '../lib/jasmine/jasmine',
			'jasmine-html': '../lib/jasmine/jasmine-html',
			'boot': '../lib/jasmine/boot'
		},
		shim:
		{
			'jasmine': {
				exports: 'window.jasmine'
			},
			'jasmine-html': {
				deps: ['jasmine'],
				exports: 'window.jasmine'
			},
			'boot': {
				deps: ['jasmine-html', 'jasmine'],
				exports: 'window.jasmine'
			}
		}
	});

	function addMatchers(jasmine)
	{
		beforeEach(function() {
            jasmine.addMatchers({

                toBeInstanceOf: function(util, customEqualityTesters)
                {
                    return  {
                        compare: function(actual, expected)
                        {
                            return {
                                pass: actual instanceof expected,
                                message: (actual instanceof expected) ? 'OK' : 'Expected ' + actual.constructor.name + ' is instance of ' + expected.name
                            };
                        }
                    };
                }
            });
        });
	}

	require(['boot'], function(jasmine)
	{
		var testRootPath = '../tests/specs/',
			specs = [];

		specs.push(testRootPath + 'data/specGrammar');
		specs.push(testRootPath + 'data/specState');
		specs.push(testRootPath + 'lexer/specLexer');
		specs.push(testRootPath + 'utils/specObj');
		specs.push(testRootPath + 'utils/specStr');
		specs.push(testRootPath + 'data/specItemRule');
		specs.push(testRootPath + 'data/specAutomata');
		specs.push(testRootPath + 'parser/specAutomataLR0Generator');

        addMatchers(jasmine);

		require(specs, window.onload);
	});

})();