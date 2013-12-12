angular.module('etsyApp').factory('itemService', function() {
	'use strict';
	var _item = {};
	return {
		get: function get() {
			return _item;
		},
		set: function set(item) {
			_item = item;
		}
	};
});