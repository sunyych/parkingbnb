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
(function() {
	'use strict';
	angular.module('app')
	.controller('NavCtrl', NavCtrl);

	NavCtrl.$inject = ['UserFactory', '$state'];

	function NavCtrl(UserFactory, $state) {
		var vm = this;
		vm.user = {};
		vm.status = UserFactory.status;
		vm.logout = UserFactory.logout;
		vm.scrollTo = function(selector){
			window.scrollTo(0, $(selector)[0].offsetTop - 5);
		};
	}
	
})();
(function() {
  'use strict';
  angular.module('app')
  .controller('postSpotCtrl', postSpotCtrl);

  postSpotCtrl.$inject = ['HomeFactory', '$state'];

  function postSpotCtrl(HomeFactory, $state) {
    var po = this;
    po.upload = upload;

    function upload() {
      HomeFactory.upload(po.spot).then(function() {
        po.spot = {};
        $state.go('parking');
      });
    }
  }
})();
(function() {
	'use strict';
	angular.module('app')
	.controller('userCtrl', userCtrl);

	userCtrl.$inject = ['UserFactory', '$state'];

	function userCtrl(UserFactory, $state) {
		var vm = this;
		vm.user = {};
		vm.status = UserFactory.status;
		vm.status.isopen=false;
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
(function() {
	'use strict';
	angular.module('app')
	.factory('HomeFactory', HomeFactory);

	HomeFactory.$inject = ['$http', '$q'];

	function HomeFactory($http, $q) {
		var o = {};
		o.spots = [];
		o.upload = upload;
		o.removeSpot = removeSpot;
		$http.get('/api/Spot').success(function(res) {
			for(var i = 0; i < res.length; i++) {
				o.spots.push(res[i]);
			}
		});
		return o;

		function upload(spot) {

			var q = $q.defer();
			spot.deleted = null;
			$http.post('/api/Spot', spot, {headers: {Authorization: 'Bearer ' + localStorage.getItem('token')}})
			.success(function(res) {
				spot._id = res._id;
				spot.created = res.created;
				spot.user = JSON.parse(atob(localStorage['token'].split('.')[1])).username;
				q.resolve();
			}).error(function(req) {
				console.error(req);
			});
			return q.promise;
		}

		function removeSpot(spt) {
			$http.delete('/api/Spot/' + spt._id, {headers: {Authorization: 'Bearer ' + localStorage['token']}}).success(function() {
				o.spots.splice(o.spots.indexOf(spt), 1);
			});
		}
	}
})();
(function() {
	'use strict';
	angular.module('app')
	.factory('UserFactory', UserFactory);

	UserFactory.$inject = ['$http', '$q'];

	function UserFactory($http, $q) {
		var o = {};
		o.status = {};
		if(getToken()) {
			o.status.isLoggedIn = true;
			o.status.username = getUsername();
		}
		else {
			o.status.isLoggedIn = false;
			o.status.username = null;
		}
		o.setToken = setToken;
		o.getToken = getToken;
		o.removeToken = removeToken;
		o.signup = signup;
		o.login = login;
		o.logout = logout;
		
		return o;


		function signup(user) {
			console.log("dfsfs");
			var q = $q.defer();
			$http.post('/api/Users/Signup', user).success(function(res) {
				setToken(res.token);
				o.status.isLoggedIn = true;
				
				q.resolve();
			});
			return q.promise;
		}
		function login(user) {
			var u = { username: user.username.toLowerCase(), password: user.password};
			var q = $q.defer();
			$http.post('/api/Users/Login', u).success(function(res) {
				setToken(res.token);
				o.status.isLoggedIn = true;
				q.resolve();
			});
			return q.promise;
		}
		function logout() {
			o.status.isLoggedIn = false;
			removeToken();
		}
		function setToken(token) {
			localStorage.setItem('token', token);
			o.status.username = getUsername();
		}
		function getToken() {
			return localStorage['token'];
		}
		function removeToken() {
			localStorage.removeItem('token');
			o.status.username = null;
		}

		function getUsername() {
			return JSON.parse(atob(getToken().split('.')[1])).username;
		}
	}
})();