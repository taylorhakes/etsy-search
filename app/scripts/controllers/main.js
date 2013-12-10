'use strict';

angular.module('etsyApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
	$scope.myData = [{name: "Moroni", age: 50},
			{name: "Tiancum", age: 43},
			{name: "Jacob", age: 27},
			{name: "Nephi", age: 29},
			{name: "Enos", age: 34}];
	$scope.gridOptions = { data: 'myData' };
  });
