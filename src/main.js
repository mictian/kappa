require.config({
    baseUrl: './src'
 });

require(['./parser/automataLR0Generator', '../tests/specs/aux/sampleGrammars', './data/state', , './lexer/lexer'], function (k, sampleGrammars)
{
    'use strict';

	//TESTS
	// var l = new k.Lexer(sampleGrammars.numDivs.g, '1/2');

	// var sItem = new k.data.ItemRule({rule:S});

	// var s = new k.data.State({
 //       items: [sItem]
	// });

    //debugger;
    var automataGenerator = new k.AutomataLR0Generator({
        grammar: sampleGrammars.numDivs.g
    });

    var a = automataGenerator.generateAutomata();

    // var newState = automataGenerator.expandItem(s);

});
