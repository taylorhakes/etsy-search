'use strict';

describe('Controller: MainCtrl', function () {

	// load the controller's module
	beforeEach(module('etsyApp'));

	var MainCtrl,
		scope,
		mockFavoriteService;

	// Initialize the controller and a mock scope
	beforeEach(inject(function ($controller, $rootScope) {
		scope = $rootScope.$new();
		mockFavoriteService = {
			callback: function () {
			},
			save: function (item) {
				this.callback('save', item);
			},
			remove: function (item) {
				this.callback('remove', item);
			},
			getAll: function() {
				return {};
			}
		};

		MainCtrl = $controller('MainCtrl', {
			$scope: scope,
			favoriteService: mockFavoriteService
		});
	}));

	describe('Initial Setup', function () {
		it('Expect the items to be empty before a search', function () {
			expect(scope.items).toBe(null);
		});
		it('Expect the text to say no items', function () {
			expect(scope.tempText.indexOf('No Items') > -1).toBeTruthy();
		});
		it('Expect the search to be empty', function () {
			expect(scope.search).toBeFalsy();
		});
	});

	describe('Favorite Items', function () {
		it('Adding a favorite', function () {
			var called = false;
			mockFavoriteService.callback = function (method) {
				if (method === 'save') {
					called = true;
				}
			};

			scope.items = [
				{ isFavorite: false },
				{}
			];
			scope.onFavorite(0);
			expect(called).toBe(true);
		});
		it('Removing a favorite', function () {
			var called = false;
			mockFavoriteService.callback = function (method) {
				if (method === 'remove') {
					called = true;
				}
			};

			scope.items = [
				{ isFavorite: true },
				{}
			];
			scope.onFavorite(0);
			expect(called).toBe(true);
		});
	});

});
