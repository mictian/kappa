/* global jasmine: true, expect: true, describe: true, it:  true, beforeEach: true, k: true, sampleGrammars: true */
'use strict';

describe('Conflict Resolver', function ()
{
    describe('constructor', function ()
    {
        it ('should create a resolver of type SHIFT/REDUCE is non type is specified', function ()
        {
            var r = new k.parser.ConflictResolver();
            expect(r.type).toBe(k.parser.conflictResolverType.STATE_SHIFTREDUCE);
        });

        it ('should create a resolver of the specified type', function ()
        {
            var r = new k.parser.ConflictResolver({
                type: k.parser.conflictResolverType.STATE_REDUCEREDUCE
            });
            expect(r.type).toBe(k.parser.conflictResolverType.STATE_REDUCEREDUCE);
        });

        it ('should define: name, type, order and a resolution function', function ()
        {
            var r = new k.parser.ConflictResolver();
            expect(r.order).toEqual(jasmine.any(Number));
        });
    });

    describe('resolve', function ()
    {
        it ('should return false if non resolution function is specified', function ()
        {
            var r = new k.parser.ConflictResolver();
            expect(r.resolve()).toBe(false);
        });

        it ('should call the resolution function with the passed in paramters if a resolution function is specified', function ()
        {
            var r = new k.parser.ConflictResolver({
                    resolveFnc: jasmine.createSpy('fake resolution function').and.returnValue(42)
                })
            ,   automata = {}
            ,   state = {state:true}
            ,   itemRule1 = 1
            ,   itemRule2 = 2;

            var result = r.resolve(automata, state, itemRule1, itemRule2);
            expect(result).toBe(42);
            expect(r.resolveFnc).toHaveBeenCalledWith(automata, state, itemRule1, itemRule2);

        });
    });

    describe('getDefaultResolvers', function()
    {
        it ('should return two default resolvers, a precendence and an associativity resolver', function ()
        {
            var defaultResolvers = k.parser.ConflictResolver.getDefaultResolvers()
            ,   containsAssociativity
            ,   containsPrecendence;

            for (var i = 0; i < defaultResolvers.length; i++) {
                expect(defaultResolvers[i]).toBeInstanceOf(k.parser.ConflictResolver);
                containsAssociativity = containsAssociativity || defaultResolvers[i].name.indexOf('associativity') > -1;
                containsPrecendence = containsPrecendence || defaultResolvers[i].name.indexOf('precedence') > -1;
            }

            expect(containsPrecendence).toBe(true);
            expect(containsAssociativity).toBe(true);
        });

        function getPrecedenceDefaultResolver ()
        {
            var all_resolvers = k.parser.ConflictResolver.getDefaultResolvers();
            for (var i = 0; i < all_resolvers.length; i++) {
                if (all_resolvers[i].name.indexOf('precedence') > -1)
                {
                    return all_resolvers[i];
                }
            }

            return false;
        }

        function getAssociativityDefaultResolver ()
        {
            var all_resolvers = k.parser.ConflictResolver.getDefaultResolvers();
            for (var i = 0; i < all_resolvers.length; i++) {
                if (all_resolvers[i].name.indexOf('associativity') > -1)
                {
                    return all_resolvers[i];
                }
            }

            return false;
        }

        describe('precendence resolver', function ()
        {
            it('should return false when the two rules does not have precendence defined', function ()
            {
                var itemRule1 = new k.data.ItemRule({
                        rule: sampleGrammars.selectedBs.S2
                    })
                ,   itemRule2 = new k.data.ItemRule({
                        rule: sampleGrammars.selectedBs.L2
                    })
                ,   resolver = getPrecedenceDefaultResolver();

                expect(resolver.resolve({},'state', itemRule1, itemRule2)).toBe(false);

            });

            it('should return false when the two rules does not have precendence number', function ()
            {
                var itemRule1 = new k.data.ItemRule({
                        rule: sampleGrammars.selectedBs.S2
                    })
                ,   itemRule2 = new k.data.ItemRule({
                        rule: sampleGrammars.selectedBs.L2
                    })
                ,   resolver = getPrecedenceDefaultResolver();

                expect(resolver.resolve({},'state', itemRule1, itemRule2)).toBe(false);

                itemRule1.rule.precendence = 'nop';
                itemRule2.rule.precendence = 'nop';
                expect(resolver.resolve({},'state', itemRule1, itemRule2)).toBe(false);

                itemRule1.rule.precendence = 'nop';
                itemRule2.rule.precendence = false;
                expect(resolver.resolve({},'state', itemRule1, itemRule2)).toBe(false);

                itemRule1.rule.precendence = function(){};
                itemRule2.rule.precendence = {};
                expect(resolver.resolve({},'state', itemRule1, itemRule2)).toBe(false);

                itemRule1.rule.precendence = '';
                itemRule2.rule.precendence = null;
                expect(resolver.resolve({},'state', itemRule1, itemRule2)).toBe(false);
            });

            it('should return a shift resolution if the shift rule have a greater precendence number', function ()
            {
                var itemRuleShift = new k.data.ItemRule({
                        rule: sampleGrammars.selectedBs.S2
                    })
                ,   itemRuleReduce = new k.data.ItemRule({
                        rule: sampleGrammars.selectedBs.L2
                    })
                ,   resolver = getPrecedenceDefaultResolver();

                itemRuleShift.rule.precendence = 42;
                itemRuleReduce.rule.precendence = 24;

                var result = resolver.resolve({},'state', itemRuleShift, itemRuleReduce);

                expect(result.action).toEqual(k.parser.tableAction.SHIFT);
                expect(result.itemRule).toBe(itemRuleShift);
            });

            it('should return a reduce resolution if the reduce rule have a greater precendence number', function ()
            {
                var itemRuleShift = new k.data.ItemRule({
                        rule: sampleGrammars.selectedBs.S2
                    })
                ,   itemRuleReduce = new k.data.ItemRule({
                        rule: sampleGrammars.selectedBs.L2
                    })
                ,   resolver = getPrecedenceDefaultResolver();

                itemRuleShift.rule.precendence = 42;
                itemRuleReduce.rule.precendence = 69;

                var result = resolver.resolve({},'state', itemRuleShift, itemRuleReduce);

                expect(result.action).toEqual(k.parser.tableAction.REDUCE);
                expect(result.itemRule).toBe(itemRuleReduce);
            });

            it('should return false of both rules have the same precendence', function ()
            {
                var itemRuleShift = new k.data.ItemRule({
                        rule: sampleGrammars.selectedBs.S2
                    })
                ,   itemRuleReduce = new k.data.ItemRule({
                        rule: sampleGrammars.selectedBs.L2
                    })
                ,   resolver = getPrecedenceDefaultResolver();

                itemRuleShift.rule.precendence = itemRuleReduce.rule.precendence = 1;

                var result = resolver.resolve({},'state', itemRuleShift, itemRuleReduce);
                expect(result).toBeFalsy();
            });

        });

        describe('associativity resolver', function ()
        {
            it('should return false if the next symbol of the shift rule have an associativity defined', function ()
            {
                var itemRuleShift = new k.data.ItemRule({
                        rule: sampleGrammars.selectedBs.S2
                    })
                ,   itemRuleReduce = new k.data.ItemRule({
                        rule: sampleGrammars.selectedBs.L2
                    })
                ,   resolver = getAssociativityDefaultResolver();


                var result = resolver.resolve({},'state', itemRuleShift, itemRuleReduce);
                expect(result).toBeFalsy();
            });

            it('should return a shift resolution if the associativity of the next shift item rule symbol is RIGHT', function ()
            {
                var itemRuleShift = new k.data.ItemRule({
                        rule: sampleGrammars.selectedBs.S2
                    })
                ,   itemRuleReduce = new k.data.ItemRule({
                        rule: sampleGrammars.selectedBs.L2
                    })
                ,   resolver = getAssociativityDefaultResolver();

                itemRuleShift.getCurrentSymbol().assoc = k.data.associativity.RIGHT;

                var result = resolver.resolve({},'state', itemRuleShift, itemRuleReduce);

                expect(result.action).toEqual(k.parser.tableAction.SHIFT);
                expect(result.itemRule).toBe(itemRuleShift);
            });

            it('should return a reduce resolution if the associativity of the next shift item rule symbol is LEFT', function ()
            {
                var itemRuleShift = new k.data.ItemRule({
                        rule: sampleGrammars.selectedBs.S2
                    })
                ,   itemRuleReduce = new k.data.ItemRule({
                        rule: sampleGrammars.selectedBs.L2
                    })
                ,   resolver = getAssociativityDefaultResolver();

                itemRuleShift.getCurrentSymbol().assoc = k.data.associativity.LEFT;

                var result = resolver.resolve({},'state', itemRuleShift, itemRuleReduce);

                expect(result.action).toEqual(k.parser.tableAction.REDUCE);
                expect(result.itemRule).toBe(itemRuleReduce);
            });
        });
    });
});