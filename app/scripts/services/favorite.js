angular.module('etsyApp').factory('favoriteService', function () {
	'use strict';

	return {
		save: function saveFavorite(item) {
			var favorites = this.getAll();
			favorites[item.listing_id] = item;
			localStorage.setItem('favorites', JSON.stringify(favorites));
		},
		remove: function removeFavorite(item) {
			var favorites = this.getAll();
			delete favorites[item.listing_id];
			localStorage.setItem('favorites', JSON.stringify(favorites));
		},
		getAll: function getFavorites() {
			var str = localStorage.getItem('favorites');
			var favorites = {};
			try {
				var parsed = JSON.parse(str);
				if(parsed) {
					favorites = parsed;
				}
			} catch(e) {

			}
			return favorites;
		}
	};
});

