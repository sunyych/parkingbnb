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