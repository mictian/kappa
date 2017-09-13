# Kappa.JS


## What is Kappa.js?
Kappa.js is a parser generator, similar to [Jison](http://jison.org), where its focus is on the learning of the parsing techniques rather than a production ready product, as Jison is.

Its main generator produce LALR(1) parsers, but the code architecture is designed to produce from LR(0) to LALR/LR(k) parsers.

The philosophy of the development is generate a dependency free, well-tested and well documented product. For this reason is that you will find that all the code is jsdoc'ed and tested.

## Features
* Allow couple and decouple communication between the parser and the lexer. This refer to the options to allow the lexer to know what are the next valid token for the parser.
* Grammars are auto-cleaned. Unreachable production and invalid epsilons values (like duplicated ones) are removed automatically when the grammar is created.
* Auto detection of nullable non-terminals
* First set calculation


# Syntax
All the code was designed in an object-oriented way so for most of developers the syntax should be easy to understand and read.

The following is a basic overview, for a full understanding of all options, methods and parameters please refer to the code. Although all the code use jsdoc, the documentation have not been generated yet (this is in the TODO list).

## Symbols
Both terminal and non-terminal inherit from Symbol. Besides a there are special tokens that are represented by this class, End of File (EOF) and Epsilon (empty). To create any of this types specify the property isSpecial to true and set the name to one of the following values:
```javascript
var specialSymbol = k.data.specialSymbol = {
	EMPTY: 'EMPTY',
	EOF : 'EOF'
};
```

Create a new symbol:
```javascript
var s = new k.data.Symbol({
	name: 'test'
});
```

## Terminals

```javascript
var t = new k.data.Terminal({name:'a_terminal', body: 'a'})
```
In this case the body can be a simple string for a literal match or a regular expression.

## Non-Terminals
```javascript
var nonTerminal = new k.data.NonTerminal({
	name: 'Test'
});
```

## Rule
```javascript
var rule = new k.data.Rule({
	head: 'Sa',
	tail: [new k.data.Terminal({name:'aa_terminal', body: 'aa'})]
}),
```
## Grammar

```javascript
var g =new k.data.Grammar({
	startSymbol: Sa.head,
	rules: [Sa, Sa1, Sa2, A, B]
});
```

## Parser

```javascript
var parser_Container = kappa.parser.parserCreator.create(
{
	grammar: someGrammar
});

parser_Container.lexer.setStream('some text to be parsed');

var parsingValue = parser_Container.parser.parse(parser_Container.lexer);
if (parsingValue)
{
    // parsingValue.currentValue contains the final result
}
else
{
    // error
}
```
# Develop
Currently there is no npm or bower package, you will need to clone the git repository. Anyway all the code is develop to work in the browser and in node/io.js.

## Build/Install
If you want to use the code, contribute or just test it, follow the next steps:
1. Clone the repository
2. run ```npm insall```
3. run ```gulp build```
4. At this point in the build folder you shuold have **kappa.min.js** file
5. run ```gulp build-concat gen-tests```
    * This allows you generate **kappa.js** file which is a dev friendly version. Besides the gen-tests gulp task generate the test to you to run it.
6. Open with your favorite browser the file: _tests/SpecRunner.html_ to run all tests

# License
The MIT License (MIT)

Copyright (c) 2017 Mictian

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

# Motivation
The principal aim of kappa is build a parse generator easy to understand.
Everyone should be able to easily read the code, jump to any part of it and understand what the is it for.
There are plenty of well-known and well documented tools out there, from Bison to Esprima, but none of them have the focus of providing a functional tool (I think this is the best way to learn something, seeing it working) where at the same time help understanding the theory and background behind it.

# State of the Art (todo)
Kappa is neither done or complete, by the contrary there is a lot of work to do.

**IMPORTANT: Unfortunately I do not have enought time to expend in this project. Due to this reason if there is anyone interested in following this project or take ownership of it, please let me know. Or if you want to use kappa for personal purpose and have any question please let me know.**

Things that are missing:
* Although almost all code have been unit tested a formal test proving that the parser generated by kappa work as expected have not been don’t yet (I have some ideas on this, if you are interested on follow this project I can help you).
* Generate and check the code documentation.
* Increase the unit-tests coverage (specially for the latest code addition).
    *  A particular to test is the lookAhead calculation with epsilon productions
