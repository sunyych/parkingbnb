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
        vm.status.isopen=false;
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
            var bounds = new google.maps.LatLngBounds(data.geometry.location);
            vm.map.fitBounds(bounds);
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
				// vm.map.setCenter(results[0].geometry.location);
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