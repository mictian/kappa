define(['../utils/obj'], function(k)
{
	'use strict';

	var State = (function()
	{

        var state = function(options)
        {
            this._items = options.items || [];
            this.index = 0;
        };

        state.prototype.getNextItem = function() {
            if (this.index < this._items.length)
                return this._items[this.index++];

            return null;
        };

        return state;
	})();

    k.data = k.utils.obj.extend(k.data || {}, {
        State: State
	});

	return k;
});