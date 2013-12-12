angular.module('etsyApp')
	.controller('MainCtrl', function ($scope, etsyService, favoriteService, itemService, $location) {
		'use strict';
		var favorites = favoriteService.getAll();
		var lastSearch = null;
		var lastSort = $scope.sort = 'new';
		var EMPTY_TEXT = 'No Items. Use Search Above';
		$scope.busy = false;
		$scope.search = null;
		$scope.items = null;
		$scope.tempText = EMPTY_TEXT;
		$scope.loading = false;

		var getItems = function getItems(val, sort, offset, replace) {
			var sort_on = 'created';
			var sort_order = 'down';

			// Turn sort word into actual sort values
			switch (sort) {
				case 'old':
					sort_order = 'up';
					break;
				case 'most':
					sort_on = 'price';
					break;
				case 'least':
					sort_on = 'price';
					sort_order = 'up';
					break;
				case 'high':
					sort_on = 'score';
					break;
			}

			etsyService.get({
				path: 'listings/active.js',
				params: {
					keywords: val,
					limit: 100,
					offset: offset ? offset : 0,
					includes: 'Images,Shop',
					sort_on: sort_on,
					sort_order: sort_order
				},
				success: function (info) {
					$scope.error = null;
					for (var i = 0; i < info.response.results.length; i++) {
						var item = info.response.results[i];
						item.isFavorite = !!favorites[item.listing_id];
						if (!replace) {
							$scope.items.push(item);
						}
					}
					if (replace) {
						$scope.items = info.response.results;
					}
				},
				error: function (info) {
					$scope.error = info.error;

				},
				done: function () {
					$scope.loading = false;
					$scope.busy = false;
					if ($scope.items.length === 0) {
						$scope.tempText = EMPTY_TEXT;
					} else {
						$scope.tempText = '';
					}
					if (!$scope.$$phase) {
						$scope.$apply();
					}
				}
			});
		};

		// Favortie an item
		$scope.onFavorite = function (index) {
			var item = $scope.items[index];
			if (item.isFavorite) {
				item.isFavorite = false;
				favoriteService.remove(item);
			} else {
				item.isFavorite = true;
				favoriteService.save(item);
			}
		};
		// Go to the details page of an item
		$scope.goToItem = function (index) {
			var item = $scope.items[index];
			itemService.set(item);
			$location.path('/item/' + item.listing_id);
		};
		// Go to the next page
		$scope.paging = function paging() {
			if ($scope.busy || !lastSearch || $scope.items == null) {
				return;
			}
			$scope.busy = true;
			getItems(lastSearch, lastSort, $scope.items.length - 1, false);
		};

		// Listen for changes in the search
		var searchTimeout = null;
		$scope.$watch('search', function (val) {
			if (!val) return;

			// debounce the search
			if (searchTimeout) clearTimeout(searchTimeout);
			searchTimeout = setTimeout(function () {
				searchTimeout = null;
				lastSearch = val;
				$scope.tempText = 'Searching for items. Please be patient';
				if ($scope.items) {
					$scope.items = null;
				}
				$scope.loading = true;
				if (!$scope.$$phase) {
					$scope.$apply();
				}
				getItems(lastSearch, lastSort, 0, true);
			}, 500);
		});

		// Listen for changes in sort
		searchTimeout = null;
		$scope.$watch('sort', function (val) {
			if (!val || val === lastSort) return;
			lastSort = val;
			if (!lastSearch) return;

			$scope.tempText = 'Searching for items. Please be patient';
			if ($scope.items) {
				$scope.items = null;
			}
			$scope.loading = true;
			if (!$scope.$$phase) {
				$scope.$apply();
			}
			getItems(lastSearch, lastSort, 0, true);
		});
	});
