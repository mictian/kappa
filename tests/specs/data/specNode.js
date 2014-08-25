/* global spyOn:true, expect: true, describe: true, it:  true, beforeEach: true */
define(['../../../src/data/sampleGrammars', '../../../src/data/node'], function(sampleGrammars, k)
{
    'use strict';

    describe('Node', function()
    {
        it('should override toString', function()
		{
			var a = new k.data.Node({});
			expect(Object.getPrototypeOf(a).hasOwnProperty('toString')).toBe(true);
		});
		
        describe('constructor', function ()
        {
            it('should define a nodes and a transitions property as arrays', function ()
            {
                var node1 = {mname:'node1'},
                    node2 = {mname:'node2'},
                    transition1 = {name:'transition1'},
                    transition2 = {name:'transition2'},
                    n = new k.data.Node({
                        nodes: [node1, node2],
                        transitions: [transition1, transition2]
                    });
                    
                expect(n.transitions).toEqual([transition1, transition2]);
                expect(n.nodes).toEqual([node1, node2]);
            });
            
            it('should define a nodes and a transitions property as arrays when they are not specified', function ()
            {
                var  n = new k.data.Node({});
                    
                expect(n.transitions).toBeInstanceOf(Array);
                expect(n.nodes).toBeInstanceOf(Array);
            });
            
            it('should accept a name property', function ()
            {
                var  n = new k.data.Node({name: 'Test'});
                    
                expect(n.name).toBe('Test');
            });
        });
        
        describe('getIdentity', function ()
        {
            it('should return a string value unique when I have more than one node', function ()
            {
                var n1 = new k.data.Node({}),
                    n2 = new k.data.Node({});
                    
                expect(n1.getIdentity()).not.toEqual(n2.getIdentity());
            });
            
            it('should return always the same id', function ()
            {
                var n = new k.data.Node({});
                
                var firstId = n.getIdentity();
                
                expect(n.getIdentity()).toBe(firstId);
                expect(n.getIdentity()).toBe(firstId);
                expect(n.getIdentity()).toBe(firstId);
                expect(n.getIdentity()).toBe(firstId);
            });
        });
        
        describe('addTransition', function ()
        {
            it('should save the new value in the list of transitions', function ()
            {
                var n = new k.data.Node({});
                
                expect(n.transitions.length).toBe(0);
                
                n.addTransition(12,'Hola');
                expect(n.transitions.length).toBe(1);
                expect(n.transitions[0].transitionValue).toBe(12);
                expect(n.transitions[0].node).toBe('Hola');
            });
        });
    });
});