/* global Springy: true */
(function()
{
    'use strict';

    require.config({
        baseUrl: '../src'
    });

    require(['./data/sampleGrammars', './parser/automataLR0Generator'], function (sampleGrammars, k)
    {
        var grammar = sampleGrammars.aPlusb.g, //aPlusb.g,
            automataGenerator = new k.parser.AutomataLR0Generator({
                grammar: grammar
            }),
            automata = automataGenerator.generateAutomata(),
            states = automata.states,
            indexedStates = {},
            graph = new Springy.Graph();

        k.utils.obj.each(states, function(state)
        {
            indexedStates[state.getIdentity()] = new Springy.Node(state.getIdentity(), {
                lrState: state,
                label: state.getIdentity() //getCondencedString() //toString()
            });
            graph.addNode(indexedStates[state.getIdentity()]);

        });

        k.utils.obj.each(states, function(state)
        {
            k.utils.obj.each(state.transitions, function(transition)
            {
                 graph.newEdge(indexedStates[state.getIdentity()], indexedStates[transition.state.getIdentity()], {
                     label: transition.symbol.toString(),
                     color: transition.state.isAcceptanceState ? '#FF0000' : undefined
                 });
            });
        });

        //TODO FIX LOOP EDGES

        jQuery('#springydemo').springy({
            graph: graph
        });

        var entityMap = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': '&quot;',
            "'": '&#39;',
            "/": '&#x2F;'
        };

        function escapeHtml(string) {
            return String(string).replace(/[&<>"'\/]/g, function (s) {
                return entityMap[s];
            });
        }

        // var gotoTable = automataGenerator.generateGOTOTable(automata);
        // var foo = gotoTable.toString();
        jQuery('#grammarShower').html(escapeHtml(grammar.toString()).replace(/\n/g,'<br/>'));

    });

})();