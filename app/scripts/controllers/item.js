angular.module('etsyApp')
	.controller('ItemCtrl', function($scope, favoriteService, itemService, $routeParams, $location, etsyService) {
		'use strict';
		$scope.item = null;
		$scope.selectedImg = null;

		// Event callbacks
		$scope.onFavorite = function(index) {
			if($scope.item.isFavorite) {
				favoriteService.remove($scope.item);
			} else {
				favoriteService.save($scope.item);
			}
			$scope.item.isFavorite = !$scope.item.isFavorite;
		};
		$scope.imgClick = function(index) {
			$scope.selectedImg = $scope.item.Images[index];
		};

		// Get all the favorites
		var favoritesHash = favoriteService.getAll();
		var savedItem = itemService.get();
		if(!$routeParams.id) {
			$location.path('/');
		}

		// Get the item from th URL
		var id = +$routeParams.id;
		if(savedItem.listing_id === id) {
			savedItem.isFavorite = !!favoritesHash[savedItem.listing_id];
			$scope.item = savedItem;
			$scope.selectedImg = savedItem.Images[0];
		} else {
			etsyService.get({
				path: 'listings/:listing_id.js',
				params: {
					listing_id: id,
					includes: 'Images,Shop'
				},
				success: function(info) {
					$scope.error = null;
					var item = info.response.results[0];
					item.isFavorite = !!favoritesHash[item.listing_id];
					$scope.item = item;
					$scope.selectedImg = item.Images[0];
				},
				error: function(info) {
					$scope.error = info.error;
				},
				done: function() {
					$scope.loading = false;
					if(!$scope.$$phase) {
						$scope.$apply();
					}
				}
			});
		}


	});