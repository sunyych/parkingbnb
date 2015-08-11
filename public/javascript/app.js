(function() {
	'use strict';
	angular.module('app', ['ui.router'])
	.config(Config);
	Config.$inject = ['$stateProvider', '$urlRouterProvider'];
	function Config($stateProvider, $urlRouterProvider) {
		$stateProvider.state('Home',{
			url: '/',
			templateUrl: 'views/home.html'
		})
		.state('parking', {
			url: '/parking',
			templateUrl: 'views/parking.html'
		})
		.state('postSpot', {
			url: '/postSpot',
			templateUrl: 'views/PostSpot.html'
		});
		$urlRouterProvider.otherwise('/');
	}


	auth.$inject = ['$rootScope', '$location', '$state', 'UserFactory'];

	function auth($rootScope, $location, $state, UserFactory) {
		$rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {
			var isLogin = toState.name === "Login";
			var isRegister = toState.name === 'Register';
			if (isLogin || isRegister) {
        return; // no need to redirect
    }
      // now, redirect only not authenticated
      var userInfo = UserFactory.status;
      if (userInfo.isLoggedIn === false) {
        e.preventDefault(); // stop current execution
        $state.go('Login'); // go to login
    }
});
	}
})();