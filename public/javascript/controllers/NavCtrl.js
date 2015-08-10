(function() {
	'use strict';
	angular.module('app')
	.controller('NavCtrl', NavCtrl);

	NavCtrl.$inject = ['$state'];

	function NavCtrl($state) {
		var vm = this;
		vm.user = {};

		vm.scrollTo = function(selector){
			window.scrollTo(0, $(selector)[0].offsetTop - 5);
		};		
	}
	
})();