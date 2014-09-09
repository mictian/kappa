/* Node
 * @class
 * @classdesc This class reprensent a generic Node class */
k.data.Node = (function () {
	/*
	 * Constructor Generic Node for any kind of graph
	 *
	 * @constructor
	 * @param {[Object]} options.transitions Array of object that initialy compone this node
	 * @param {String} options.name Optioanl node identifiation
	 * @param {[Node]} options.nodes Array of node instances that are children of this current node
	 */
	var node = function (options)
	{
		this.options = options;
		
		k.utils.obj.defineProperty(this, 'transitions');
		k.utils.obj.defineProperty(this, 'nodes');
		k.utils.obj.defineProperty(this, 'name');
		
		k.utils.obj.defineProperty(this, '_id');
		
		this.transitions = options.transitions || [];
		this.nodes = options.nodes || [];
	};
	
	/* @function Returns the string ID of the current state
	 * @returns {String} ID  */
	node.prototype.getIdentity = function()
	{
		if (!this._id) {
			this._id = this._generateIdentity();
		}
		return this._id;
	};
	
	/* @function Generates an ID that identify this node from any other state
	 * @returns {String} Generated ID  */
	node.prototype._generateIdentity = function()
	{
		return this.name || k.utils.obj.uniqueId('node_');
	};
	
	/* @function Add a new transaction into the list of transactions of the current state
	 * @param {Object} transitionValue Object use to make the transition (i.e. symbol), description of the arista (like the name of the transition)
	 * @param {Node} node Destination node (or state) arrived when moving with the specified tranisiotn
	 * @returns {Void}  */
	node.prototype.addTransition = function (transitionValue, node)
	{
		this.transitions.push(this._generateNewTransition(transitionValue, node));
		this.nodes.push(node);
	};
	
	/* @function Function responsible the creation of new transition objects
	 * @param {Object} transitionValue Object use to make the transition, description of the arista (like the name of the transition)
	 * @param {Node} node Destination node (or state) arrived when moving with the specified tranisiotn
	 * @returns {Object} Transition object  */
	node.prototype._generateNewTransition = function (transitionValue, node)
	{
		return {
			transitionValue: transitionValue,
			node: node
		};
	};
	
	/* @function Gets the node identity
	* @returns {String} A formatted string id of the node */
	node.prototype.toString = function ()
	{
		return this.getIdentity();
	};
	
	return node;
})();
