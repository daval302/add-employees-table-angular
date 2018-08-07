(function (angular){

	'use strict';

	angular.module('app', [])

	.controller('MainController', ['$http', '$scope', function($http, $scope){
		
		$scope.employees = [];

		$http.get('json/sample_shiftsv2.json')
			.then(shiftsLoaded)
			.catch(shiftsLoadFailed)

		$scope.formatShift = formatShift;

		function shiftsLoaded(response) {
			$scope.employees = response.data.slice(0,10)
		}
		function shiftsLoadFailed(err) {
			console.error("Cannot load because", err.toString())
		}

		function formatShift(shifts, day) {
			var shift = shifts.find(function (shift) {
				return moment(shift.date, "YYYY-MM-DD").weekday() == day
			})
			if (!shift) {
				return "";
			}

			return shift.slot
		}
	}])

	.directive('mainView', function(){
		return {
			templateUrl: 'views/main-view.html',
			controller: 'MainController'
		}
	})

})(window.angular);