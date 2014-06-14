/* global Springy: true */
(function()
{
    'use strict';
    
    require.config({
        baseUrl: '../src'
    });
    
    require(['./data/sampleGrammars', './parser/automataLR0Generator'], function (sampleGrammars, k)
    {
        var automataGenerator = new k.parser.AutomataLR0Generator({
                grammar: sampleGrammars.numDivs.g
            }),
            automata = automataGenerator.generateAutomata(),
            states = automata.states,
            indexedStates = {},
            graph = new Springy.Graph();
            
        k.utils.obj.each(states, function(state)
        {
            indexedStates[state.getIdentity()] = new Springy.Node(state.getIdentity(), {
                lrState: state,
                label: state.getIdentity() //toString()
            });
            graph.addNode(indexedStates[state.getIdentity()]);
            
        });
        
        k.utils.obj.each(states, function(state)
        {
            k.utils.obj.each(state.transitions, function(transition)
            {
                 graph.newEdge(indexedStates[state.getIdentity()], indexedStates[transition.state.getIdentity()], {
                     label: transition.symbol.toString()
                 });
            });
        });
        
        jQuery('#springydemo').springy({
            graph: graph
        });
    
    });

})();