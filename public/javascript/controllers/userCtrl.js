(function() {
	'use strict';
	angular.module('app')
	.controller('userCtrl', userCtrl);

	userCtrl.$inject = ['UserFactory', '$state'];

	function userCtrl(UserFactory, $state) {
		var vm = this;
		vm.user = {};
		
		
		vm.signup=signup;
		vm.login=login;
		

		function signup (){
			var u = vm.user;
			if(!u.username || !u.email || !u.password || !u.cpassword || !(u.password === u.cpassword)){
				return false;
			}
			UserFactory.signup(u).then(function(){
				vm.user = {};
				$state.go('parking');
			});
		}
		function login(){
			UserFactory.login(vm.user).then(function(){
				vm.user = {};
				$state.go('parking');
				
			});
		}
		function logout(){
			UserFactory.logout();
		}

	}
	
})();