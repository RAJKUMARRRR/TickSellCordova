var movies = angular.module('app.movies', []);
movies.controller('movies_home', ['$scope', '$state', '$stateParams', 'MoviesList', '$http',
    'SellerObjectService','utilities',
    function ($scope, $state, $stateParams, MoviesList, $http, SellerObjectService, utilities) {
        $scope.homeBuyOnClick = function (movie) {
            SellerObjectService.setSelectedMovie(movie);
            $state.go('menu.sellersList');
        };
        $scope.homeSellOnClick = function (movie) {
            if (SellerObjectService.getProfileObject() === null) {
                $state.go('login');
                return;
            }
            SellerObjectService.setSelectedMovie(movie);
            $state.go('menu.sellDetailsForm1');
        };
        utilities.showLoader();
        $http.get("https://sheltered-wave-68112.herokuapp.com/movies")
                .then(function (response) {
                    $scope.moviesList = response.data;
                    for (var i = 0; i < $scope.moviesList.length; i++) {
                        var url = "https://sheltered-wave-68112.herokuapp.com/api/img/img_";
                        loadImage(url + $scope.moviesList[i].image, i);
                    }
                    utilities.hideLoader();
                });
        var loadImage = function (url, index) {
            $http.get(url)
                    .then(function (response) {
                        $scope.moviesList[index].alt_image = response.data;
                    });
        };
    }]);
