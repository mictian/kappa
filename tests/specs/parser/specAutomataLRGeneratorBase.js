/* global jasmine: true, expect: true, describe: true, it:  true, beforeEach: true, k: true, sampleGrammars: true */
'use strict';

describe('Automata LR Generator Base', function ()
{
	describe('constructor', function()
	{
		it('requires an options parameter', function()
		{
			expect(function() { return new k.parser.AutomataLRGeneratorBase(); }).toThrow();
		});

		it('requires an options parameter with a grammar in it', function()
		{
			expect(function() { return new k.parser.AutomataLRGeneratorBase({}); }).toThrow();
		});

		it('should save the passed in options', function()
		{
			var options = {
					grammar: sampleGrammars.idsList.g
				},
				ag = new k.parser.AutomataLRGeneratorBase(options);

			expect(ag.options).toBe(options);
		});
	});

	describe('generateGOTOTable', function ()
	{
		it('should return the expected table for the simple LR0 grammar a+b', function ()
		{
			var ag = new k.parser.AutomataLR0Generator({
					grammar: sampleGrammars.aPlusb.g
				}),
				automata = ag.generateAutomata(),
				gotoTable = ag.generateGOTOTable(automata);

			expect(gotoTable).toEqual(jasmine.any(Object));
			expect(gotoTable['0(1)']).toEqual(jasmine.any(Object));

			var keys = k.utils.obj.keys(gotoTable);

			expect(k.utils.obj.indexOf(keys, '0(0)1(0)2(0)') >= 0).toBe(true);
			expect(k.utils.obj.indexOf(keys, '2(1)') >= 0).toBe(true);
			expect(k.utils.obj.indexOf(keys, '1(1)1(0)2(0)') >= 0).toBe(true);
			expect(k.utils.obj.indexOf(keys, '1(2)') >= 0).toBe(true);
			expect(k.utils.obj.indexOf(keys, '0(1)') >= 0).toBe(true);
			expect(k.utils.obj.indexOf(keys, 'AcceptanceState') >= 0).toBe(true);
		});

		it('should return a table with only two entries when having a simple automata with only two transitions', function ()
		{
			var automata = new k.data.Automata({}),
				automataGenerator = new k.parser.AutomataLRGeneratorBase({grammar:sampleGrammars.aPlusb.g}),
				state1 = new k.data.State({name:'state1'}),
				state2 = new k.data.State({name:'state2'});

			automata.addState(state1);
			automata.addState(state2);
			state1.addTransition('to2', state2);
			state2.addTransition('to1', state1);

			var gotoTable = automataGenerator.generateGOTOTable(automata);

			expect(gotoTable.state1).toBeDefined();
			expect(gotoTable.state2).toBeDefined();

			expect(k.utils.obj.keys(gotoTable.state1).length).toBe(1);
			expect(gotoTable.state1.to2).toBe(state2);

			expect(k.utils.obj.keys(gotoTable.state2).length).toBe(1);
			expect(gotoTable.state2.to1).toBe(state1);
		});

		it('should return a table with only two entries when having a simple automata with moltiples entries that superpose eachother', function ()
		{
			var automata = new k.data.Automata({}),
				automataGenerator = new k.parser.AutomataLRGeneratorBase({grammar:sampleGrammars.aPlusb.g}),
				state1 = new k.data.State({name:'state1'}),
				state2 = new k.data.State({name:'state2'});

			automata.addState(state1);
			automata.addState(state1);
			automata.addState(state1);

			automata.addState(state2);

			state1.addTransition('to2', state2);
			state1.addTransition('to2', state2);
			state1.addTransition('to2', state2);

			state2.addTransition('to1', state1);
			state2.addTransition('to1', state2);
			state2.addTransition('to1', state1);

			var gotoTable = automataGenerator.generateGOTOTable(automata);

			expect(gotoTable.state1).toBeDefined();
			expect(gotoTable.state2).toBeDefined();

			expect(k.utils.obj.keys(gotoTable.state1).length).toBe(1);
			expect(gotoTable.state1.to2).toBe(state2);

			expect(k.utils.obj.keys(gotoTable.state2).length).toBe(1);
			expect(gotoTable.state2.to1).toBe(state1);
		});
	});

	describe('isAutomataValid', function ()
	{
	    it('should return false if there is one invalid state', function()
		{
			var automataGenerator = new k.parser.AutomataLRGeneratorBase({grammar:sampleGrammars.aPlusb.g}),
				a = new k.data.Automata({
				states: [
					{
						getIdentity: function() {
							return '1';
						},
						isValid: function ()
						{
							return false;
						}
					},
					{
						getIdentity: function() {
							return '2';
						},
						isValid: function ()
						{
							return true;
						}
					},
					{
						getIdentity: function() {
							return '3';
						},
						isValid: function ()
						{
							return true;
						}
					}
				]
			});

			expect(automataGenerator.isAutomataValid(a)).toBe(false);
		});

		it('should return false if all states are invalid', function ()
		{
			var automataGenerator = new k.parser.AutomataLRGeneratorBase({grammar:sampleGrammars.aPlusb.g}),
				a = new k.data.Automata({
				states: [
					{
						getIdentity: function() {
							return '1';
						},
						isValid: function ()
						{
							return false;
						}
					},
					{
						getIdentity: function() {
							return '2';
						},
						isValid: function ()
						{
							return false;
						}
					},
					{
						getIdentity: function() {
							return '3';
						},
						isValid: function ()
						{
							return false;
						}
					}
				]
			});

			expect(automataGenerator.isAutomataValid(a)).toBe(false);
		});

		it('should return TRUE if the automata has no states', function ()
		{
			var automataGenerator = new k.parser.AutomataLRGeneratorBase({grammar:sampleGrammars.aPlusb.g}),
				a = new k.data.Automata({});

			expect(automataGenerator.isAutomataValid(a)).toBe(true);
		});

		it('should return true if all states are valid', function()
		{
		    var automataGenerator = new k.parser.AutomataLRGeneratorBase({grammar:sampleGrammars.aPlusb.g}),
				a = new k.data.Automata({
				states: [
					{
						getIdentity: function() {
							return '1';
						}
					},
					{
						getIdentity: function() {
							return '2';
						}
					},
					{
						getIdentity: function() {
							return '3';
						}
					}
				]
			});

			spyOn(automataGenerator, 'isStateValid').and.returnValue(true);
			expect(automataGenerator.isAutomataValid(a)).toBe(true);
		});

	});
});