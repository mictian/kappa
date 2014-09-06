/* global Springy: true */
(function()
{
    'use strict';

    require.config({
        baseUrl: '../../src'
    });

    require(['./data/sampleGrammars', './parser/parser'], function (sampleGrammars, k)
    {
        var pContainer = k.parser.parserCreator.create(
				    {
						grammar: sampleGrammars.arithmetic.g
					});

        $('#inputarea').keypress(function (e)
        {
            if (e.which == 13)
            {
                var $text = $(e.target);
                pContainer.lexer.setStream($text.val());
                
                var parsingValue = pContainer.parser.parse(pContainer.lexer);
                if (parsingValue)
                {
                    $('#result').text(parsingValue.currentValue);
                }
                else
                {
                    $('#result').text('Invalid input, please try again!');
                }
            }
        });

    });

})();