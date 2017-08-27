var reviews = angular.module('app.reviews', []);
reviews.controller('reviewsController', ['$scope', '$stateParams', '$state',
    '$http', 'SellerObjectService','utilities','updateService',
    function ($scope, $stateParams, $state, $http, SellerObjectService,utilities,updateService) {
        utilities.showLoader();
        $scope.onAddReviewClick = function (movie) {
            if (SellerObjectService.getProfileObject() === null) {
                $state.go('login');
                return;
            }
            SellerObjectService.setSelectedMovie(movie);
            $state.go('menu.review_add');
        };
        $scope.form = {};
        $scope.form.selectedRating = "2";
        $scope.listReviewsOnClick = function (movie) {
            SellerObjectService.setSelectedMovie(movie);
            $state.go('menu.reviews_list');
        };
        $http.get("https://sheltered-wave-68112.herokuapp.com/movies")
                .then(function (response) {
                    $scope.moviesList = response.data;
                    for (var i = 0; i < $scope.moviesList.length; i++) {
                        var url = "https://sheltered-wave-68112.herokuapp.com/api/img/img_";
                        loadImage(url + $scope.moviesList[i].image, i);
                    }
                    if (SellerObjectService.getProfileObject() !== null) {
                        var liked = JSON.parse(SellerObjectService.getProfileObject().liked);
                        //alert(JSON.stringify(liked));
                        var disliked = JSON.parse(SellerObjectService.getProfileObject().disliked);
                        for(var i=0;i<$scope.moviesList.length;i++){
                            if(liked.hasOwnProperty($scope.moviesList[i]._id)){
                               $scope.moviesList[i].isLiked = true;
                               $scope.moviesList[i].likedColor = "#4CAF50";
                            }
                            else{
                               $scope.moviesList[i].isLiked = false;                                  
                               $scope.moviesList[i].likedColor = "#424242";
                            }
                            if(disliked.hasOwnProperty($scope.moviesList[i]._id)){
                               $scope.moviesList[i].isDisliked = true;  
                               $scope.moviesList[i].dislikedColor = "#F44336";
                            }
                            else{
                               $scope.moviesList[i].isDisliked = false;                                  
                               $scope.moviesList[i].dislikedColor = "#424242";
                            }
                        }
                    }
                    utilities.hideLoader();
                });
        var loadImage = function (url, index) {
            $http.get(url)
                    .then(function (response) {
                        $scope.moviesList[index].alt_image = response.data;
                    });
        };
        $scope.likeOnClick = function (movie) {
            if (SellerObjectService.getProfileObject() === null) {
                $state.go('login');
                return;
            }
            //alert(movie.isLiked);
            if(movie.isLiked){
                return;
            }
            var data = {};
            data.likes = parseInt(movie.likes)+1;
            movie.likes = parseInt(movie.likes)+1;
            data.dislikes = parseInt(movie.dislikes);
            data.rating = movie.rating;
            if (movie.isDisliked) {
                movie.likedColor = "#4CAF50";
                movie.dislikedColor = "#424242";
                data.dislikes = parseInt(movie.dislikes)-1;
                movie.dislikes = parseInt(movie.dislikes)-1;
            }
            else{
                movie.likedColor = "#4CAF50";
                movie.dislikedColor = "#424242";                
            }
            updateService.updateMovie(movie._id,data);
            var profile = SellerObjectService.formatProfileObject(SellerObjectService.getProfileObject());
            var liked = JSON.parse(profile.liked);
            liked[movie._id] = movie.name;
            profile.liked = JSON.stringify(liked);
            if (movie.isDisliked) {
                var disliked = JSON.parse(profile.disliked);
                delete disliked[movie._id];
                profile.disliked = JSON.stringify(disliked);
            }
            updateService.updateUser(profile.user_id, profile);
            var reset = SellerObjectService.getProfileObject();
            reset.liked = JSON.stringify(liked);
            if (movie.isDisliked) {
                reset.disliked = JSON.stringify(disliked);
            }
            SellerObjectService.setProfileObject(reset);
            movie.isLiked = true;
            movie.isDisliked = false;
        };
        $scope.dislikeOnClick = function(movie){
            if (SellerObjectService.getProfileObject() === null) {
                $state.go('login');
                return;
            }
            if(movie.isDisliked){
                return;
            }
            var data = {};
            data.likes = parseInt(movie.likes);
            data.dislikes = parseInt(movie.dislikes)+1;
            movie.dislikes = parseInt(movie.dislikes)+1;
            data.rating = movie.rating;
            if (movie.isLiked) {
                movie.likedColor = "#424242";
                movie.dislikedColor = "#F44336";
                data.likes = parseInt(movie.likes)-1;
                movie.likes = parseInt(movie.likes)-1;
            }
            else{
                movie.likedColor = "#424242";
                movie.dislikedColor = "#F44336";                
            }
            updateService.updateMovie(movie._id,data);
            var profile = SellerObjectService.formatProfileObject(SellerObjectService.getProfileObject());
            var disliked = JSON.parse(profile.disliked);
            disliked[movie._id] = movie.name;
            profile.disliked = JSON.stringify(disliked);
            if (movie.isLiked) {
                var liked = JSON.parse(profile.liked);
                delete liked[movie._id];
                profile.liked = JSON.stringify(liked);
            }
            updateService.updateUser(profile.user_id, profile);
            var reset = SellerObjectService.getProfileObject();
            reset.disliked = JSON.stringify(disliked);
            if (movie.isLiked) {
                reset.liked = JSON.stringify(liked);
            }
            SellerObjectService.setProfileObject(reset);
            movie.isDisliked = true;
            movie.isLiked = false;
        };
    }]);
reviews.controller('reviewListController', ['$scope', '$stateParams', '$state',
    'SellerObjectService', '$http','utilities',
    function ($scope, $stateParams, $state, SellerObjectService, $http,utilities) {
        utilities.showLoader();
        $scope.onViewClick = function (review) {
            SellerObjectService.setSelectedReview(review);
            $state.go('menu.review_details');
        };
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
        $scope.reviewsList = [];
        var movieId = SellerObjectService.getSelectedMovie()._id;
        var url = "https://sheltered-wave-68112.herokuapp.com/reviews/movie_id/" + movieId;
        $http.get(url)
                .then(function (response) {
                    $scope.reviewsList = response.data;
                });
                utilities.hideLoader();
    }]);
reviews.controller('reviewDetailsController', ['$scope', '$stateParams', '$state', '$http',
    'SellerObjectService',
    function ($scope, $stateParams, $state, $http, SellerObjectService) {
        $scope.review = SellerObjectService.getSelectedReview();
    }]);
reviews.controller('addReviewController', ['$scope', '$stateParams', '$state',
    'SellerObjectService', '$http', '$ionicLoading', '$ionicPopup', '$ionicHistory',
    'googleLogin','utilities',
    function ($scope, $stateParams, $state, SellerObjectService, $http, $ionicLoading,
    $ionicPopup, $ionicHistory, googleLogin,utilities) {
        $scope.review = {
            "user_id": "785HHGHBBB",
            "user_name":"",
            "image_url":"",
            "movie_id": "",
            "title": "",
            "heighlites": "",
            "drawbacks": "",
            "tagline": "",
            "rating": "4.5",
            "timestamp": new Date()
        };
        var user_profile = SellerObjectService.getProfileObject();
        $scope.review.user_name = user_profile.displayName;
        $scope.review.image_url = user_profile.imageUrl;
        //$scope.review.user_id = SellerObjectService.getProfileObject().user_id;
        var movieId = SellerObjectService.getSelectedMovie()._id;
        $scope.review.movie_id = movieId;
        $scope.review.title = SellerObjectService.getSelectedMovie().name;
        $scope.submitReviewClick = function () {
            utilities.showLoader();
            var fd = new FormData();
            var uploadUrl = 'https://sheltered-wave-68112.herokuapp.com/reviews';
            //alert("send"+JSON.stringify(send));
            var send = $scope.review;
            for (var key in send)
                fd.append(key, send[key]);
            //alert("fd"+JSON.stringify(fd));
            $http.post(uploadUrl, fd, {
                transformRequest: angular.indentity,
                headers: {'Content-Type': undefined}
            })
                    .then(function (response) {

                        var data = response.data;
                        var status = response.status;
                        var statusText = response.statusText;
                        var headers = response.headers;
                        var config = response.config;
                        if (parseInt(status) === 200) {
                            $scope.showPopup();
                        }
                        utilities.hideLoader();
                    });
        };
        $scope.showPopup = function () {
            var alertPopup = $ionicPopup.alert({
                title: 'Title',
                template: '<h5 class="balanced" align="center" style="font-weight:900">Successfully Published.</h5>',
                buttons: [
                    {
                        text: '<b>Save</b>',
                        type: 'button-assertive'
                    }
                ]});
            alertPopup.then(function (res) {
                $ionicLoading.show({
                    template: '<p>Loading...</p><ion-spinner></ion-spinner>'
                });
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });

                $state.go('menu.reviews');
                $ionicLoading.hide();
            });
        };
    }]);

