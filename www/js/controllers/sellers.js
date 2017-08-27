var sellers = angular.module('app.sellers', []);
sellers.controller('sellersListCtrl', ['$scope', '$state', '$stateParams',
    '$http', 'SellerObjectService','utilities',
    function ($scope, $state, $stateParams, $http, SellerObjectService,utilities) {
        utilities.showLoader();
        $scope.listItems = [
            /*{
             "header1": "one",
             "header2": "$19.19",
             "header3": "three",
             "header4": "four"
             }*/
        ];
        var movieId = SellerObjectService.getSelectedMovie()._id;
        var url = "https://sheltered-wave-68112.herokuapp.com/sellers/movie_id/" + movieId;
        //alert(url);
        $http.get(url)
                .then(function (response) {
                    //alert(JSON.stringify(response));
                    var temp = response.data;
                    for (var i = 0; i < temp.length; i++) {
                        temp[i].header1 = temp[i].movie_name;
                        temp[i].header2 = temp[i].price;
                        temp[i].header3 = temp[i].tickets;
                        temp[i].header4 = temp[i].hall_name;
                    }
                    $scope.listItems = temp;
                    utilities.hideLoader();
                });

        $scope.buyOnClick = function (seller) {
            //alert(JSON.stringify(seller));
            SellerObjectService.setSelectedSeller(seller);
            //$state.go('menu.selletDetails');
            $state.go('selletDetails');
        };
    }]);

sellers.controller('sellerDetailsController', ['$scope', '$stateParams', 'SellerObjectService',
    function ($scope, $stateParams, SellerObjectService) {
        $scope.seller = SellerObjectService.getSelectedSeller();
        $scope.movie = {};
        $scope.movie = SellerObjectService.getSelectedMovie();
        $scope.formatTimeStamp = function(date){
            var gdate = new Date(date);
            var tdate = new Date();
            var timeDiff = Math.abs(tdate.getTime() - gdate.getTime());
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
            if(diffDays<=1){
                if(gdate.getHours()<12){
                    return gdate.getHours()+":"+gdate.getMinutes()+" AM";
                }
                else{
                return (gdate.getHours()-12)+":"+gdate.getMinutes()+" PM";
               }
            }
            else{
                if(diffDays===2)
                    return (diffDays-1)+" Day Ago";
                else
                    return (diffDays-1)+" Days Ago";
           }
        };
        //alert(JSON.stringify($scope.movie));
        //var trailer = $scope.movie.trailer_link;
        //trailer = trailer.split("=")[1];
        //$scope.movie.trailer_link = "http://www.youtube.com/embed/" + trailer + "?rel=0&autoplay=true";
    }]);
