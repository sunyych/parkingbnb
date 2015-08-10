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
})();
