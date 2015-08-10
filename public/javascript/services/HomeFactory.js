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