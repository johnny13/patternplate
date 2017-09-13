'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = composeReducers;

var _lodash = require('lodash');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function composeReducers() {
	for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
		args[_key] = arguments[_key];
	}

	var required = args.reduce(function (registry, arg) {
		var amend = arg.dependencies || [];
		return [].concat(_toConsumableArray(registry), _toConsumableArray(amend));
	}, []);

	var reducer = function reducer(state, action, dependencies) {
		return args.reduce(function (state, arg) {
			return arg(state, action, (0, _lodash.pick)(dependencies, arg.dependencies || []));
		}, state);
	};

	reducer.dependencies = required;
	return reducer;
}