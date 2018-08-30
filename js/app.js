(function (angular){

	'use strict';

	angular.module('app', [])

	.controller('MainController', ['$http', '$scope', function($http, $scope){
		
		$scope.employees = [];
		$scope.shiftEdit = "N/A";
		$scope.addNewEmployee = "";
		$scope.debdeb = [];

		$scope.editList = [];
		$scope.deleteList = [];
		$scope.deb = false;
		$scope.slotInput = "";

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
			elemSelector.attr('selezionato', 'true')
		}

		function unyellow(elemSelector){
			elemSelector.css({"background-color": ""});
			elemSelector.attr('selezionato', 'false');
		}

		function updateFormOnHoverElement(mainElem, elemSelector){
			var oldval = elemSelector.html();
			elemSelector.hover(function(){
				// put the selected item down below within a form to edit
				mainElem.find("label[for=shiftEdit]").html(oldval).attr('shiftid', elemSelector.attr('shiftid'));
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

		// BUTTONS edit, delete, undo

		function undo(mainElem){
			unbindSlots(mainElem);
			selectingSlots(mainElem, slotSelector);
			unyellow(mainElem.find('div[selezionato=true]'));
		}

		function edit(scope, mainElem){
			var labelElem = mainElem.find('label[for=shiftEdit]');
			var selectedId = labelElem.attr('shiftid');
			var selectedSlot = labelElem.html();
			var newSlot = scope.slotInput;

			if (newSlot != selectedSlot && newSlot.length >= 3){
				var duplicates = false;

				for (var i = scope.editList.length - 1; i >= 0; i--) {
					if (scope.editList[i]['id'] == selectedId){
						duplicates=true; break;}/*end for*/}
				if (duplicates){
					scope.editList[i]['slot'] = newSlot;
				}else{
					scope.editList.push({'id': selectedId, 'slot': newSlot});
				}
				if (scope.deb == true)
					scope.$apply();				
			}


		}

		function deleteShift(scope, mainElem){
			var labelElem = mainElem.find('label[for=shiftEdit]');
			var selectedId = labelElem.attr('shiftid');

			var duplicates = false;

			for (var i = scope.deleteList.length - 1; i >= 0; i--) {
				if (scope.deleteList[i]['id'] == selectedId){
					duplicates=true; break;}/*end for*/}
			if (!duplicates){
				scope.deleteList.push({'id': selectedId});
			}
			if (scope.deb == true)
				scope.$apply();		
		}

		// end -- BUTTONS edit, delete, undo

		// add new emplyee 

		function addNewEmployee(scope, mainElem){;
			scope.employees.push({
				'name' : scope.addNewEmployee,
				'shifts' : (function(){
					var ret = [];
					for (var i = 1; i <= 7 ; i++) {
						ret.push({
							"date" : "2018-08-0" + i.toString(),
							"slot" : "OFF"
						})/*end for loop*/}
					return ret;
				})()
			});
			scope.$apply();
			unbindSlots(mainElem)
			selectingSlots(mainElem, slotSelector);
		}

		// end add new emplyee  

		return {
			templateUrl: 'views/main-view.html',
			controller: 'MainController',
			link: function(scope, elem, attr){
				scope.renderingTable = $interval(function(){
					if (scope.employees.length == elem.find('tr').length - 1){
						selectingSlots(elem, slotSelector);
						$interval.cancel( scope.renderingTable )
					}
				}, 500);
				
				// BUTTONS edit, delete, undo listeners
				elem.find('input[name=undo]').click(function(){
					undo(elem)
				});
				elem.find('input[name=edit]').click(function(){
					edit(scope, elem )
				});
				elem.find('input[name=delete]').click(function(){
					deleteShift(scope, elem )
				});
				elem.find('input[name=newEmployeeButton]').click(function(){
					addNewEmployee(scope, elem)
				});
				elem.find('input[name=deb]').click(function(){
					scope.deb = !scope.deb;
					scope.$apply();
				})
				// end BUTTONS edit, delete, undo listeners
			}
		}
	})

})(window.angular);