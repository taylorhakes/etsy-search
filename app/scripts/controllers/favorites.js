angular.module('etsyApp')
	.controller('FavoritesCtrl', function ($scope, favoriteService) {
		'use strict';
		$scope.search = null;
		$scope.tempText = '';
		$scope.loading = false;

		$scope.onFavorite = function(index) {
			var item = $scope.items[index];
			$scope.items.splice(index, 1);
			favoriteService.remove(item);
			$scope.$apply();
		};

		var favoritesHash = favoriteService.getAll();
		var favorites = [];
		for(var key in favoritesHash) {
			if(favoritesHash.hasOwnProperty(key)) {
				favorites.push(favoritesHash[key]);
			}
		}
		$scope.items = favorites;
	});

