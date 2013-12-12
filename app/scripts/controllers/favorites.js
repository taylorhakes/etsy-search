angular.module('etsyApp')
	.controller('FavoritesCtrl', function ($scope, favoriteService, itemService, $location) {
		'use strict';
		var oldFilter = '';
		$scope.search = null;
		$scope.tempText = '';
		$scope.loading = false;

		// Event callbacks
		$scope.onFavorite = function(index) {
			var item = $scope.items[index];
			$scope.items.splice(index, 1);
			favoriteService.remove(item);
			if(!$scope.$$phase) {
				$scope.$apply();
			}
		};
		$scope.goToItem = function(index) {
			var item = $scope.items[index];
			itemService.set(item);
			$location.path('/item/' + item.listing_id);
		};

		// By default, get all the favorites
		var favoritesHash = favoriteService.getAll();
		var favorites = [];
		for(var key in favoritesHash) {
			if(favoritesHash.hasOwnProperty(key)) {
				favorites.push(favoritesHash[key]);
			}
		}
		var allFavorites = favorites;
		$scope.items = favorites;

		// Filter
		$scope.$watch('filter', function(val) {
			if(val === oldFilter) return;
			oldFilter = val;
			if(!val) {
				$scope.items = allFavorites;
			} else {
				var filteredItems = [];
				// Create an escaped Regex
				var regex = new RegExp(val.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), 'ig');
				for(var i = 0; i < allFavorites.length; i++) {
					if(allFavorites[i].Shop.shop_name.match(regex) || allFavorites[i].title.match(regex)) {
						filteredItems.push(allFavorites[i]);
					}
				}
				$scope.items = filteredItems;
			}
			if(!$scope.$$phase) {
				$scope.$apply();
			}

		});
	});

