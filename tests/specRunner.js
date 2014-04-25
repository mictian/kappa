require.config({
    paths:
    {
        'jasmine': '../lib/jasmine/jasmine',
        'jasmine-html': '../lib/jasmine/jasmine-html'
    },
    shim:
    {
        jasmine: {
            exports: 'jasmine'
        },
        'jasmine-html': {
            deps: ['jasmine'],
            exports: 'jasmine'
        }
    }
});


(function(){
	var jasmineEnv = jasmine.getEnv();
    //jasmineEnv.updateInterval = 1000;

    var specs = [];
    specs.push('./specs/grammar');
    specs.push('./specs/lexer');

    require(specs, function (spec) {
        jasmineEnv.execute();
    });
})();
