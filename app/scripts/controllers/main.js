angular.module('etsyApp')
  .controller('MainCtrl', function ($scope, etsyService, favoriteService) {
		'use strict';
		var favorites = favoriteService.getAll();
		var lastSearch = null;
		$scope.busy = false;
		$scope.search = null;
    	$scope.items = null;
		$scope.tempText = '';
		$scope.loading = false;

		$scope.onFavorite = function(index) {
			var item = $scope.items[index];
			if (item.isFavorite) {
				item.isFavorite = false;
				favoriteService.remove(item);
			} else {
				item.isFavorite = true;
				favoriteService.save(item);
			}
		};

		$scope.paging = function paging() {
			if ($scope.busy) {
				return;
			}
			$scope.busy = true;
			etsyService.get({
				path: 'listings/active.js',
				params: {
					keywords: val,
					limit: 100,
					includes: 'Images:1,Shop'
				},
				success: function(info) {
					$scope.error = null;
					for (var i = 0; i < info.response.results.length; i++) {
						var item = info.response.results[i];
						item.isFavorite = !!favorites[item.listing_id];
					}
					$scope.items = info.response.results;
				},
				error: function(info) {
					$scope.error = info.error;

				},
				done: function() {
					$scope.loading = false;
					$scope.tempText = '';
					$scope.busy = false;
					$scope.$apply();
				}
			});
		}


		var searchTimeout  = null;
		$scope.$watch('search', function(val) {
			if(!val) return;

			// debounce the search
			if(searchTimeout) clearTimeout(searchTimeout);
			searchTimeout = setTimeout(function() {
				searchTimeout = null;
				lastSearch = val;
				if(!$scope.tempText) {
					$scope.tempText = 'Searching for items. Please be patient';
					if($scope.items) {
						$scope.items = null;
					}
					$scope.loading = true;
					$scope.$apply();
				}
				etsyService.get({
					path: 'listings/active.js',
					params: {
						keywords: val,
						limit: 100,
						includes: 'Images:1,Shop'
					},
					success: function(info) {
						$scope.error = null;
						for (var i = 0; i < info.response.results.length; i++) {
							var item = info.response.results[i];
							item.isFavorite = !!favorites[item.listing_id];
						}
						$scope.items = info.response.results;
					},
					error: function(info) {
						$scope.error = info.error;

					},
					done: function() {
						$scope.loading = false;
						$scope.tempText = '';
						$scope.$apply()
					}
				});
			},500);
		});
  });
