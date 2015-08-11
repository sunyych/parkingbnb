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

	HomeController.$inject = ['HomeFactory', 'UserFactory'];

	function HomeController(HomeFactory, UserFactory) {
		var vm = this;
		vm.spots = HomeFactory.spots;
		vm.deleteSpot = deleteSpot;
		vm.codeAddress = codeAddress;
		vm.status = UserFactory.status;
		vm.logout = UserFactory.logout;
        

        function deleteSpot(spt) {
         HomeFactory.removeSpot(spt);
     }

		// map function
		google.maps.event.addDomListener(window, 'load', init);

		var geocoder;
		var map;

		function init() {
			geocoder = new google.maps.Geocoder();
  		var latlng = new google.maps.LatLng(37.775, -122.419);// San Francisco
    	// Basic options for a simple Google Map
    	// For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
    	var mapOptions = {
        // How zoomed in you want the map to start at (always required)
        zoom: 15,

        // The latitude and longitude to center the map (always required)
        center: latlng, 

        // Disables the default Google Maps UI components
        disableDefaultUI: true,
        scrollwheel: true,
        draggable: true,
        scaleControl: true,
        panControl:true,
        zoomControl:true,

        // How you would like to style the map. 
        // This is where you would paste any style found on Snazzy Maps.
        styles: [{
        	"featureType": "water",
        	"elementType": "geometry",
        	"stylers": [{
        		"color": "#000000"
        	}, {
        		"lightness": 17
        	}]
        }, {
        	"featureType": "landscape",
        	"elementType": "geometry",
        	"stylers": [{
        		"color": "#000000"
        	}, {
        		"lightness": 20
        	}]
        }, {
        	"featureType": "road.highway",
        	"elementType": "geometry.fill",
        	"stylers": [{
        		"color": "#000000"
        	}, {
        		"lightness": 17
        	}]
        }, {
        	"featureType": "road.highway",
        	"elementType": "geometry.stroke",
        	"stylers": [{
        		"color": "#000000"
        	}, {
        		"lightness": 29
        	}, {
        		"weight": 0.2
        	}]
        }, {
        	"featureType": "road.arterial",
        	"elementType": "geometry",
        	"stylers": [{
        		"color": "#000000"
        	}, {
        		"lightness": 18
        	}]
        }, {
        	"featureType": "road.local",
        	"elementType": "geometry",
        	"stylers": [{
        		"color": "#000000"
        	}, {
        		"lightness": 16
        	}]
        }, {
        	"featureType": "poi",
        	"elementType": "geometry",
        	"stylers": [{
        		"color": "#000000"
        	}, {
        		"lightness": 21
        	}]
        }, {
        	"elementType": "labels.text.stroke",
        	"stylers": [{
        		"visibility": "on"
        	}, {
        		"color": "#000000"
        	}, {
        		"lightness": 16
        	}]
        }, {
        	"elementType": "labels.text.fill",
        	"stylers": [{
        		"saturation": 36
        	}, {
        		"color": "#000000"
        	}, {
        		"lightness": 40
        	}]
        }, {
        	"elementType": "labels.icon",
        	"stylers": [{
        		"visibility": "off"
        	}]
        }, {
        	"featureType": "transit",
        	"elementType": "geometry",
        	"stylers": [{
        		"color": "#000000"
        	}, {
        		"lightness": 19
        	}]
        }, {
        	"featureType": "administrative",
        	"elementType": "geometry.fill",
        	"stylers": [{
        		"color": "#000000"
        	}, {
        		"lightness": 20
        	}]
        }, {
        	"featureType": "administrative",
        	"elementType": "geometry.stroke",
        	"stylers": [{
        		"color": "#000000"
        	}, {
        		"lightness": 17
        	}, {
        		"weight": 1.2
        	}]
        }]
    };


    vm.search = function() {
    	HomeFactory.search(geocoder).then(function(data){
    		vm.map.setCenter(data.geometry.location);
            // should zoom in when search a location
            // vm.map.fitBounds(data.geometry.location);
        });
    };

    // Get the HTML DOM element that will contain your map 
    // We are using a div with id="map" seen below in the <body>
    var mapElement = document.getElementById('map');

    // Create the Google Map using out element and options defined above
    vm.map = new google.maps.Map(mapElement, mapOptions);
    
    // Custom Map Marker Icon - Customize the map-marker.png file to customize your icon
    vm.image = 'bootstrap/img/map_marker-512.png';
    var myLatLng = new google.maps.LatLng(37.775, -122.419);
    
}

function codeAddress() {
	var addresses = vm.spots.map(function(obj){
		return obj.address;
	});

	angular.forEach(addresses, function(address){
		geocoder.geocode( { address: address}, function(results, status) {
			
			if (status == google.maps.GeocoderStatus.OK && results.length>0) {
				vm.map.setCenter(results[0].geometry.location);
				var marker = new google.maps.Marker({
					map: vm.map,
					position: results[0].geometry.location,
					icon: vm.image
				});
			} else {
				alert('Geocode was not successful for the following reason: ' + status);
			}
		});
	});	
}
}	
})();
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
		o.search = search;
		$http.get('/api/Spot').success(function(res) {
			for(var i = 0; i < res.length; i++) {
				o.spots.push(res[i]);
			}
		});
		return o;

		function search(geocoder) {
			var q = $q.defer();
			var address = document.getElementById("address").value;
			geocoder.geocode( {'address': address}, function(results, status) {

				if (status == google.maps.GeocoderStatus.OK) {
					q.resolve(results[0]);
					//vm.map.setCenter(results[0].geometry.location);
				} else {
					alert('Geocode was not successful for the following reason: ' + status);
					q.reject();
				}
			});
			return q.promise;

		}

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