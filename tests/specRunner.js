
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

addMatchers(jasmine);


var k = kappa
,   sampleGrammars = k.data.sampleGrammars;

