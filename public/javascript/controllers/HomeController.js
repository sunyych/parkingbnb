(function() {
	'use strict';
	angular.module('app')
	.controller('HomeController', HomeController);

	HomeController.$inject = ['HomeFactory'];

	function HomeController(HomeFactory) {
		var vm = this;
		vm.spots = HomeFactory.spots;
		vm.deleteSpot = deleteSpot;

		function deleteSpot(spt) {
			HomeFactory.removeSpot(spt);
		}
	}
})();