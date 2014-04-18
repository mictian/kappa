define(['../core'], function(k)
{
	if (!k.utils)
	{
		k.utils = {};
	}

	k.utils.obj = (function(){

         /*
        * @func Util function used to apply "Inheritance"
        *
        * @param {Object} superType Object to inherit from
        * @param {Object} subType Enhanced Object
        */
        var __extends = this.__extends || function (subType, superType) {
            for (var p in superType)
                if (superType.hasOwnProperty(p))
                    subType[p] = superType[p];
            function __() {
                this.constructor = subType;
            }
            __.prototype = superType.prototype;
            subType.prototype = new __();
        };

        return {
            extends: __extends
        };

    })();

    return k;
});