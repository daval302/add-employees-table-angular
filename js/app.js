(function (angular){

	'use strict';

	angular.module('app', [])

	.controller('MainController', function($scope){
		
		$scope.employees = [];

		$.getJSON('json/sample_shifts.json', function(data){
			$scope.employees = data.slice(0,10); $scope.$digest();
		});

	})

	.directive('mainView', function(){
		return {
			templateUrl: 'views/main-view.html',
			controller: 'MainController'
		}
	})

})(window.angular);