'use strict';

angular.module('etsyApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
])
	.config(function ($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'views/main.html',
				controller: 'MainCtrl'
			})
			.when('/favorites', {
				templateUrl: 'views/favorites.html',
				controller: 'FavoritesCtrl'
			})
			.otherwise({
				redirectTo: '/'
			});
	}).run(function($rootScope) {
		$rootScope.$on('$routeChangeSuccess', function(ev,data) {
			if (data.$$route && data.$$route.controller)
				$rootScope.controller = data.$$route.controller;
		})
	});
