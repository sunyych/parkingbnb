angular.module('app').controller('TestCtrl', ["$scope", "$modal", function ($scope, $modal) {

  $scope.open = function (spot) {

    var modalInstance = $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'spotModal.html',
      controller: 'ModalInstanceCtrl',
      resolve: {
        spot: function () {
          return spot;
        }
      }
    });
  };
}]);

angular.module('app').controller('ModalInstanceCtrl', ["$scope", "$modalInstance", "spot", function ($scope, $modalInstance, spot) {
  $scope.spot = spot;

  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}]);