/* ASTNode
 * @class
 * @classdesc This class reprensent an AST NODE, a sub-type of a generic Node */
k.data.ASTNode = (function(_super) {
	'use strict';
	
	/* jshint latedef:false */
	k.utils.obj.inherit(astNode, _super);
	
	/*
	 * Constructor AST Node
	 *
	 * @constructor
	 * @param {Rule} options.rule Asociated reduce rule that originate the node creation
	 * @param {String} options.stringValue Optional string chunk that originate the node creation
	 * @param {Symbol} options.symbol Optional Symbol. Used ad the head of the rule that is related with the current ASTNode
	 * @param {[Object]} options.transitions Array of object that initialy compone this node
	 * @param {[Node]} options.nodes Array of Nodes instances (or just objects) that are children of this Node
	 */
	function astNode (options)
	{
		_super.apply(this, arguments);

		k.utils.obj.defineProperty(this, 'rule');
		k.utils.obj.defineProperty(this, 'stringValue');
		k.utils.obj.defineProperty(this, 'currentValue');
		k.utils.obj.defineProperty(this, 'symbol');
	}

	/* @function Generates a string representation of the current AST Node
	 * @param {Boolean} options.deep True in case to print the entire node and its children
	 * @returns {String} formatted string */
	astNode.prototype.toString = function(options)
	{
		if (options && !k.utils.obj.isUndefined(options.deep))
		{
			options.deep = k.utils.obj.isNumber(options.deep) ? options.deep : 0;
			var tabs = k.utils.str.tabs(options.deep);
			++options.deep;
			
			return tabs + this._toCurrentString() + '\n' + k.utils.obj.reduce(this.nodes, function (acc, node) {
				return acc + (k.utils.obj.isString(node) ? k.utils.str.tabs(options.deep) + node + '\n' : node.toString({deep: options.deep}));
			},'');
		} 
		
		return this._toCurrentString();
	};
	
	/* @function Generates a string representation of the current AST Node
	 * @returns {String} formatted string */
	astNode.prototype._toCurrentString = function ()
	{
		return this.getIdentity() + (this.rule ? ': '+ this.rule.toString() + ' (' + this.currentValue + ')' : '');
	};
	
	return astNode;
})(k.data.Node);