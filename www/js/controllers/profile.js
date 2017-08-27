var profile = angular.module('app.profile', []);
profile.controller('profileCtrl', ['$scope', '$stateParams', '$http',
    'SellerObjectService', '$state',
    function ($scope, $stateParams, $http, SellerObjectService, $state) {
        $scope.profile = {};
        $scope.profile.isLoggedIn = false;
        if (SellerObjectService.getProfileObject() === null) {
            $scope.profile.isLoggedIn = false;
            $scope.form = {};
            $scope.form.imageUrl = "img/profile_dummy.png";
        } else {
            $scope.profile.isLoggedIn = true;
            $scope.form = SellerObjectService.getProfileObject();
        }
        $scope.onLoginClick = function () {
            $state.go('login');
        };
    }]);
 