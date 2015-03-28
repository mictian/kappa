$(document).ready(function ()
{
    var pContainer = kappa.parser.parserCreator.create(
			    {
					grammar: jsGrammar(kappa),
					lexer: {
					    usePriorities: true,
					    useMultipleMatching: true
					}
				});

    $('#inputarea').focus();
    $('#inputarea').keypress(function (e)
    {
        if (e.which == 13)
        {
            var $text = $(e.target);
            pContainer.lexer.setStream($text.val());

            var parsingValue = pContainer.parser.parse(pContainer.lexer);
            if (!parsingValue.error)
            {
                $('#result').text('RECOGNIZED');
            }
            else
            {
                $('#result').html('Invalid input, please try again!<br/>Line: ' + parsingValue.line + '<br/>Position: '+ parsingValue.character + '<br/>Type: ' + parsingValue.type
                + '<br/>Extra: ' + JSON.stringify(parsingValue.extra));
            }
        }
    });
});