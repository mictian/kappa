require.config({
    baseUrl: "./src"
 });

require(['./data/grammar', './lexer/lexer'], function (k)
{
	//TESTS
	debugger;
	window.k = k;

});
