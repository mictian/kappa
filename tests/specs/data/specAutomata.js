/* global expect: true, describe: true, it:  true, beforeEach: true */
define(['../../../src/data/sampleGrammars', '../../../src/data/automata'], function(sampleGrammars, k)
{
    'use strict';

    describe('automata', function()
    {
		it('shoud override toString', function()
		{
			var a = new k.data.Automata({});
			expect(Object.getPrototypeOf(a).hasOwnProperty('toString')).toBe(true);
		});

		describe('constructor', function()
		{
			it('should define a states array if not specified', function()
			{
				var a = new k.data.Automata({});

				expect(a.states).toBeDefined();
				expect(a.states).toBeInstanceOf(Array);
				expect(a.states.length).toBe(0);
			});

			it('should save the states property if specified', function()
			{
				var a = new k.data.Automata({
					states: [{
						getIdentity: function() {return 1; }
					}, {
						getIdentity: function() {return 2; }
					}, {
						getIdentity: function() {return 3; }
					}]
				});

				expect(a.states).toBeDefined();
				expect(a.states).toBeInstanceOf(Array);
				expect(a.states.length).toBe(3);
				expect(a.states[0].getIdentity()).toBe(1);
				expect(a.states[1].getIdentity()).toBe(2);
				expect(a.states[2].getIdentity()).toBe(3);
			});

			it('should save the specified options', function()
			{
				var options = {
						name: 'testing',
						forReal: true
					},
					a = new k.data.Automata(options);

				expect(a.options).toBe(options);
			});
		});

		describe('getNextState', function()
		{
			it('should return falsy if we retrieve all automata\'s states', function()
			{
				var a = new k.data.Automata({
					states: [{
						getIdentity: function() {return 1; }
					}, {
						getIdentity: function() {return 2; }
					}, {
						getIdentity: function() {return 3; }
					}]
				});

				a.getNextState(); //get 1
				a.getNextState(); //get 2
				a.getNextState(); //get 3

				var result = a.getNextState();
				expect(result).toBeFalsy();
			});

			it('should return falsy if there is no state', function()
			{
				var a = new k.data.Automata({});

				expect(a.getNextState()).toBeFalsy();
			});

			it('should return the first state only once', function()
			{
				var state1 = {
						getIdentity: function() {return 1; }
					},
					state2 = {
						getIdentity: function() {return 2; }
					},
					state3 = {
						getIdentity: function() {return 3; }
					},
					a = new k.data.Automata({
						states: [state1, state2, state3]
					});

				expect(a.getNextState()).toBe(state1); //get 1
				expect(a.getNextState()).toBe(state2); //get 2
				expect(a.getNextState()).toBe(state3); //get 3

				var result = a.getNextState();
				expect(result).toBeFalsy();
			});
			
			it('should return added states', function ()
			{
				var shiftItem2 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S1])[0],
					shiftItem1 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.L1])[0],
					reduceItem1 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S2])[0],
					reduceItem2 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.L2])[0],
					state1 = new k.data.State({
						items: [shiftItem1, reduceItem1]
					}),
					state2 = new k.data.State({
						items: [shiftItem2, reduceItem2]
					}),
					automata = new k.data.Automata({});
					
				reduceItem1.dotLocation = 3;
				reduceItem2.dotLocation = 3;
				
				reduceItem1._id = null;
				reduceItem2._id = null;
				reduceItem1.lookAhead.push(shiftItem2.getCurrentSymbol());
				reduceItem2.lookAhead.push(shiftItem2.getCurrentSymbol());
				
				expect(automata.getNextState()).toBeFalsy();
				
				automata.addState(state1);
				expect(automata.getNextState()).toBe(state1);
				
				automata.addState(state2);
				expect(automata.getNextState()).toBe(state2);
			});
			
			it('should add as unprocessed state when adding an already present state but with different lookAhead (editing existing state) (USING LOOKAHEAD of course)', function ()
			{
				var shiftItem1 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.L2])[0],
					reduceItem1 = k.data.ItemRule.newFromRules([sampleGrammars.selectedBs.S2])[0],
					state1 = new k.data.State({
						items: [shiftItem1, reduceItem1]
					}),
					//We clone the reduce items, so when adding extra symbols in tis lookAhead, this new symbols will be only in hte cloned item rule and not in the original one
					clonedReduceItem = reduceItem1.clone(),
					state2 = new k.data.State({
						items: [shiftItem1, clonedReduceItem]
					}),
					automata = new k.data.Automata({
						hasLookAhead: true
					});
					
				//This cause that the itemrule identity change, se we need to update the state register items
				reduceItem1.dotLocation = 3;
				reduceItem1._id = null;
				reduceItem1.lookAhead.push(shiftItem1.getCurrentSymbol());
				
				clonedReduceItem.dotLocation = 3;
				clonedReduceItem._id = null;
				clonedReduceItem.lookAhead.push(shiftItem1.getCurrentSymbol());
				
				state1._registerItems = {};
				state1._registerItemRules();
				
				state2._registerItems = {};
				state2._registerItemRules();
				
				expect(automata.getNextState()).toBeFalsy();
				
				automata.addState(state1);
				expect(automata.getNextState()).toBe(state1);
				expect(automata.getNextState()).toBeFalsy();
				
				clonedReduceItem.lookAhead.push(shiftItem1.rule.tail[1]);
				
				automata.addState(state2);
				expect(automata.getNextState()).toEqual(state1);
			});
		});
		
		describe('isValid', function()
		{
		    it('should return false if there is one invalid state', function()
			{
				var a = new k.data.Automata({
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

				expect(a.isValid()).toBe(false);
			});
			
			it('should return false if all states are invalid', function ()
			{
				var a = new k.data.Automata({
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

				expect(a.isValid()).toBe(false);
			});
			
			it('should return TRUE if the automata has no states', function ()
			{
				var a = new k.data.Automata({});
				expect(a.isValid()).toBe(true);
			});
			
			it('should return true if all states are valid', function()
			{
			    var a = new k.data.Automata({
					states: [
						{
							getIdentity: function() {
								return '1';
							},
							isValid: function ()
							{
								return true;
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

				expect(a.isValid()).toBe(true);
			});
		});
		
		describe('initialStateAccessor', function()
		{
		    it('should set the initial state if it is passed', function()
		    {
		        var a = new k.data.Automata({}),
		        	expectedResult = {
						mock:true
					};
					
				a.initialStateAccessor(expectedResult);
				expect(a.initialStateAccessor()).toBe(expectedResult);
		    });
		    
		    it('should return the initial state if nothing is passed', function()
		    {
		        var expectedResult = {
						mock:true
					},
					a = new k.data.Automata({initialState: expectedResult});
		        	
				expect(a.initialStateAccessor()).toBe(expectedResult);
		    });
		});

		describe('addState', function()
		{
			it('should throw an exception if the state is invalid', function()
			{
				var a = new k.data.Automata({});

				expect(function() { return a.addState({}); }).toThrow();
			});

			it('should add the specified state', function()
			{
				var a = new k.data.Automata({});

				a.addState({
					getIdentity: function() {return 1; }
				});

				expect(a.getNextState().getIdentity()).toBe(1);
			});

			it('should add only once each state', function()
			{
				var a = new k.data.Automata({});

				a.addState({
					getIdentity: function() {return 1; }
				});

				a.addState({
					getIdentity: function() {return 1; }
				});

				expect(a.getNextState().getIdentity()).toBe(1);
				expect(a.getNextState()).toBeFalsy();
			});
		});
    });

});