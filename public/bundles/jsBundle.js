(function() {
	'use strict';
	angular.module('app', ['ui.router'])
	.config(Config);
	Config.$inject = ['$stateProvider', '$urlRouterProvider'];
	function Config($stateProvider, $urlRouterProvider) {
		$stateProvider.state('Home',{
			url: '/',
			templateUrl: 'views/home.html'
		});
		$urlRouterProvider.otherwise('/');
	}
})();

(function() {
	'use strict';
	angular.module('app')
	.controller('HomeController', HomeController);

	HomeController.$inject = [];

	function HomeController() {
		var vm = this;
		vm.title = 'Welcome to our App!';
	}
})();
(function() {
	'use strict';
	angular.module('app')
	.controller('NavCtrl', NavCtrl);

	NavCtrl.$inject = ['$state'];

	function NavCtrl($state) {
		var vm = this;
		vm.scrollTo = function(selector){
			window.scrollTo(0, $(selector)[0].offsetTop - 5);
		};
	}
	
})();
(function() {
	'use strict';
	angular.module('app')
	.factory('HomeFactory', HomeFactory);

	HomeFactory.$inject = ['$http', '$q'];

	function HomeFactory($http, $q) {
		var o = {};
		
		return o;
	}
})();