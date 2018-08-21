(function (angular){

	'use strict';

	angular.module('app', [])

	.controller('MainController', ['$http', '$scope', function($http, $scope){
		
		$scope.employees = [];
		$scope.shiftEdit = "N/A";

		$http.get('json/sample_shiftsv2.json')
			.then(shiftsLoaded)
			.catch(shiftsLoadFailed)

		$scope.formatShift = formatShift;
		$scope.getId = getId;

		function shiftsLoaded(response) {
			$scope.employees = response.data.slice(0,10)
		}
		function shiftsLoadFailed(err) {
			console.error("Cannot load because", err.toString())
		}

		function getId(shifts, day) {
			var shift = shifts.find(function (shift) {
				return moment(shift.date, "YYYY-MM-DD").weekday() == day
			})
			return shift.id;
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

	.directive('mainView', function($interval){

		var slotSelector = 'div[shiftid]';

		function yellow(elemSelector){
			elemSelector.css({"background-color": "yellow"});
		}

		function unyellow(elemSelector){
			elemSelector.css({"background-color": ""});
		}

		function updateFormOnHoverElement(mainElem, elemSelector){
			var oldval = elemSelector.html();
			elemSelector.hover(function(){
				// put the selected item down below within a form to edit
				mainElem.find("label[for=shiftEdit]").html(oldval);
			}, function(){
				$(this).html(oldval)
			});
		}

		function unbindSlots(mainElem){
			mainElem.find('div[shiftid]').each(function(i,e){
					$(this).unbind('mouseenter mouseleave click');
				})
		}

		function selectingSlots(mainElem, slotSelector){
			mainElem.find(slotSelector).each(function(i,e){
				updateFormOnHoverElement(mainElem, $(this));
				// trigger the selection to edit the shift
				$(this).click(function(){
					// freeze the input, so stop listening for hovering
					yellow($(this));
					unbindSlots(mainElem);
				});
			} );
		}

		function undo(mainElem){
			unbindSlots(mainElem);
			// ..
		}


		return {
			templateUrl: 'views/main-view.html',
			controller: 'MainController',
			link: function(scope, elem, attr){
				scope.renderingTable = $interval(function(){
					if (scope.employees.length == elem.find('tr').length - 1){
						selectingSlots(elem, slotSelector);
						$interval.cancel( scope.renderingTable )
					}

				}, 500)
			}
		}
	})

})(window.angular);