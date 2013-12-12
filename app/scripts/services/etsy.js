
angular.module('etsyApp').factory('etsyService', function () {
	'use strict';
	var api = new EtsyJsonp({
		apiKey: 'tn86rbm07punitug51dos2wd'
	});
	return api;
});
