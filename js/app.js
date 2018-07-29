(function (angular){

	'use strict';

	angular.module('app', [])

	.controller('MainController', ['$http', '$scope', function($http, $scope){
		
		$scope.employees = [];

		$http.get('json/sample_shifts.json')
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
			var [startTime, endTime] = shift.value.split("-")
	
			return startShift(startTime) + "-" + endShift(endTime)
		}
		function startShift(startTime) {
			switch (startTime) {
				case "1": return 13;
				case "3": return 15;
				default: return startTime;
			}
		}
		function endShift(endTime) {
			switch (endTime) {
				case "1": return 13;
				case "3": return 15;
				case "7": return 19;
				default: return endTime;
			}
		}
	}])

	.directive('mainView', function(){
		return {
			templateUrl: 'views/main-view.html',
			controller: 'MainController'
		}
	})

})(window.angular);