angular.module('app.controllers', [])

        .controller('homeCtrl', ['$scope', '$state', '$stateParams', 'MoviesList','$http','SellerObjectService','utilities', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
            function ($scope, $state, $stateParams, MoviesList,$http,SellerObjectService,utilities) {
                //$scope.moviesList = MoviesList.getMoviesList();
                //alert(JSON.stringify(this.moviesList));
                $scope.homeBuyOnClick = function (movie) {
                    SellerObjectService.setSelectedMovie(movie);
                    $state.go('menu.sellersList');
                };
                $scope.homeSellOnClick = function (movie) {
                    SellerObjectService.setSelectedMovie(movie);
                    $state.go('menu.sellDetailsForm1');
                };
                utilities.showLoader();
                $http.get("https://sheltered-wave-68112.herokuapp.com/movies")
                        .then(function (response) {
                            //$scope.myWelcome = response.data;
                            //alert(JSON.stringify(response));
                            $scope.moviesList = response.data;
                            for(var i=0;i<$scope.moviesList.length;i++){
                            var url = "https://sheltered-wave-68112.herokuapp.com/api/img/img_";
                                loadImage(url+$scope.moviesList[i].image,i);
                        }
                        utilities.hideLoader();
                            //$scope.image = response.data;
                        });
                var loadImage = function(url,index){
                    //alert(url);
                $http.get(url)
                        .then(function (response) {
                            //$scope.myWelcome = response.data;
                            //alert(JSON.stringify(response));
                            //$scope.image = response.data;
                            $scope.moviesList[index].alt_image = response.data;
                        });
                    };
            }])

        .controller('loginController', ['$scope', '$stateParams','$state','SellerObjectService','$cordovaOauth','timeStorage','$http','$ionicHistory', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
            function ($scope, $stateParams, $state,SellerObjectService,$cordovaOauth,timeStorage,$http,$ionicHistory) {
                $scope.onGoogleLoginClick = function () {
                    window.plugins.googleplus.login(
                            {},
                            function (obj) {
                                alert("Success:" + JSON.stringify(obj));
                                SellerObjectService.setProfileObject(obj);
                                $ionicHistory.nextViewOptions({
                                    disableBack: true
                                });
                                $state.go('menu.home');
                                var user = {};
                                user.name = obj.displayName;
                                user.email = obj.email;
                                user.mobile = "9999999999";
                                user.password = obj.email;
                                if (obj.hasOwnProperty("imageUrl"))
                                    user.profile_image_url = obj.imageUrl;
                                else
                                    user.profile_image_url = "img/profile_dummy.png";
                                $scope.addProfile(user);
                            },
                            function (msg) {
                                alerrt("error:" + JSON.stringify(msg));
                            }
                    );
                };
                $scope.skipOnClick = function(){
                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });
                    $state.go('menu.home');
                };
                $scope.onFacebookLoginClick = function () {
                    var fb_appId = "349567598789354";
                    $cordovaOauth.facebook(fb_appId,
                            ["email"]).then(function (result) {
                        //alert(result.access_token);
                        $http.get("https://graph.facebook.com/v2.2/me", {params: {access_token: result.access_token, fields: "id,name,gender,location,website,picture,relationship_status,email", format: "json"}}).then(function (result) {
                            //alert(JSON.stringify(result));
                            var profile = result.data;
                            var profile_data = {};
                            profile_data.imageUrl = profile.picture.data.url;
                            profile_data.displayName = profile.name;
                            profile_data.email = profile.email;
                            SellerObjectService.setProfileObject(profile_data);
                            $ionicHistory.nextViewOptions({
                                disableBack: true
                            });
                            $state.go('menu.home');
                            var user = {};
                            user.name = profile.name;
                            user.email = profile.email;
                            user.mobile = "9999999999";
                            user.password = profile.email;
                            user.profile_image_url = profile.picture.data.url;
                            $scope.addProfile(user);
                        }, function (error) {
                            alert("There was a problem getting your profile.  Check the logs for details.");
                        });
                    }, function (error) {
                        alert(error);
                    });
                };
                $scope.addProfile = function (profile) {
                    var uploadUrl = 'https://sheltered-wave-68112.herokuapp.com/users';
                    var fd = new FormData();
                    for (var key in profile)
                        fd.append(key, profile[key]);
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
                                    alert("User added successfully."+JSON.stringify(response));
                                }
                            });
                };
                $scope.login = {};
                $scope.login.email = "";
                $scope.login.password = "";
                $scope.onLoginClick = function(){
                var uploadUrl = 'https://sheltered-wave-68112.herokuapp.com/users/login';
                var sendLoginData = {
                    "email": $scope.login.email,
                    "password": $scope.login.password
                };
                var fd = new FormData();
                for (var key in sendLoginData)
                    fd.append(key, sendLoginData[key]);
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
                                    //alert("Login  sent successfully."+JSON.stringify(response));
                                    if (data.status_code === "5000") {
                                        alert(data.status);
                                    } else if (data.status_code === "2000") {
                                        var profile = data.profile;
                                        var profile_data = {};
                                        profile_data.imageUrl = profile.profile_image_url;
                                        profile_data.displayName = profile.name;
                                        profile_data.email = profile.email;
                                        SellerObjectService.setProfileObject(profile_data);
                                        $ionicHistory.nextViewOptions({
                                            disableBack: true
                                        });
                                        $state.go('menu.home');

                                    } else if (data.status_code === "3000") {
                                        alert(data.status);
                                    }
                                }
                            });                    
                };
            }])
        .controller('sellersListCtrl', ['$scope', '$state', '$stateParams', '$http', 'SellerObjectService', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
            function ($scope, $state, $stateParams,$http,SellerObjectService) {
                $scope.listItems = [
                    /*{
                        "header1": "one",
                        "header2": "$19.19",
                        "header3": "three",
                        "header4": "four"
                    }*/
                ];
                var movieId = SellerObjectService.getSelectedMovie()._id;
                var url = "https://sheltered-wave-68112.herokuapp.com/sellers/movie_id/"+movieId;
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
                        });

                $scope.buyOnClick = function (seller) {
                    //alert(JSON.stringify(seller));
                    SellerObjectService.setSelectedSeller(seller);
                    $state.go('menu.selletDetails');
                };
            }])

        .controller('cloudCtrl', ['$scope', '$stateParams','$http','SellerObjectService','$state', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
            function ($scope, $stateParams,$http,SellerObjectService,$state) {
                $scope.profile = {};
                $scope.profile.isLoggedIn = false;
                //alert(JSON.stringify(SellerObjectService.getProfileObject()));
                if(SellerObjectService.getProfileObject() === null){
                $scope.profile.isLoggedIn = false;
                $scope.form = {};
                $scope.form.imageUrl = "img/profile_dummy.png";
                }
                else{
                //alert(JSON.stringify(SellerObjectService.getProfileObject()));
                $scope.profile.isLoggedIn = true;                                        
                $scope.form = SellerObjectService.getProfileObject();
                }
                $scope.onLoginClick = function(){
                  $state.go('menu.login');  
                };
                $scope.play = function(){
                    $scope.link += "Ia6EXfqKiV4"+"?rel=0&autoplay=true";
                    //$scope.hasOverlayBeenClicked = true;
                  //YoutubeVideoPlayer.openVideo('YOUTUBE_VIDEO_ID', function(result) { console.log('YoutubeVideoPlayer result = ' + result); });  
                };
                $http.get("https://sheltered-wave-68112.herokuapp.com/movies")
                        .then(function (response) {
                            //$scope.myWelcome = response.data;
                            //alert(JSON.stringify(response));
                            $scope.moviesList = response.data;
                            for(var i=0;i<$scope.moviesList.length;i++){
                                var trailer = $scope.moviesList[i].trailer_link;
                                trailer = trailer.split("=")[1];
                                //alert(trailer);
                                $scope.moviesList[i].trailer_link = "http://www.youtube.com/embed/" + trailer +"?rel=0&autoplay=true"; 
                                }
                                
                            //$scope.image = response.data;
                        });

            }])
        .controller('reviewsController', ['$scope', '$stateParams','$state','$http','SellerObjectService', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
            function ($scope, $stateParams,$state,$http,SellerObjectService) {
                $scope.onAddReviewClick = function(movie){
                     if(SellerObjectService.getProfileObject() === null){
                         $state.go('menu.login');
                         return;
                     }
                     SellerObjectService.setSelectedMovie(movie);
                     $state.go('menu.review_add');
                };
                $scope.form = {};
                $scope.form.selectedRating = "2";
                $scope.listReviewsOnClick = function (movie) {
                    //alert(JSON.stringify($scope.form));
                    SellerObjectService.setSelectedMovie(movie);
                    $state.go('menu.reviews_list');
                };
                $http.get("https://sheltered-wave-68112.herokuapp.com/movies")
                        .then(function (response) {
                            //$scope.myWelcome = response.data;
                            //alert(JSON.stringify(response));
                            $scope.moviesList = response.data;
                            for(var i=0;i<$scope.moviesList.length;i++){
                            var url = "https://sheltered-wave-68112.herokuapp.com/api/img/img_";
                                loadImage(url+$scope.moviesList[i].image,i);
                        }
                            //$scope.image = response.data;
                        });
                var loadImage = function(url,index){
                    //alert(url);
                $http.get(url)
                        .then(function (response) {
                            //$scope.myWelcome = response.data;
                            //alert(JSON.stringify(response));
                            //$scope.image = response.data;
                            $scope.moviesList[index].alt_image = response.data;
                        });
                    };

            }])
        .controller('reviewListController', ['$scope', '$stateParams','$state','SellerObjectService','$http', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
            function ($scope, $stateParams,$state,SellerObjectService,$http) {
                $scope.onViewClick = function(review){
                  //alert(JSON.stringify(review));
                  SellerObjectService.setSelectedReview(review);
                  $state.go('menu.review_details');  
                };
                $scope.reviewsList = [];
                var movieId = SellerObjectService.getSelectedMovie()._id;
                var url = "https://sheltered-wave-68112.herokuapp.com/reviews/movie_id/"+movieId;
                //alert(url);
                $http.get(url)
                        .then(function (response) {
                          //alert(JSON.stringify(response));
                          $scope.reviewsList = response.data;
                        });


            }])
        .controller('reviewDetailsController', ['$scope', '$stateParams','$state','$http','SellerObjectService', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
            function ($scope, $stateParams,$state,$http,SellerObjectService) {
                        $scope.review = SellerObjectService.getSelectedReview();
                        //alert(JSON.stringify($scope.review));
            }])
        .controller('addReviewController', ['$scope', '$stateParams','$state','SellerObjectService','$http','$ionicLoading','$ionicPopup','$ionicHistory','googleLogin', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
            function ($scope, $stateParams,$state,SellerObjectService,$http,$ionicLoading,$ionicPopup,$ionicHistory,googleLogin) {
                $scope.review = {
                    "user_id":"785HHGHBBB",
                    "movie_id":"",
                    "title":"",
                    "heighlites":"",
                    "drawbacks":"",
                    "tagline":"",
                    "rating":"4.5",
                    "timestamp": new Date()
                };
                //$scope.review.user_id = SellerObjectService.getProfileObject().user_id;
                var movieId = SellerObjectService.getSelectedMovie()._id;
                $scope.review.movie_id = movieId;
                $scope.review.title = SellerObjectService.getSelectedMovie().name;
                $scope.submitReviewClick = function(){
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
                                if(parseInt(status) === 200){
                                    $scope.showPopup();
                                }
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
                        var data = SellerObjectService.getSellerObject();
                        //alert(JSON.stringify(data));
                        /*$http.get("http://services.groupkt.com/country/get/all").success(function (data) {
                         alert(JSON.stringify(data));
                         $ionicLoading.hide();
                         });*/

                    });
                };                
            }])
        .controller('sellerDetailsController', ['$scope', '$stateParams','SellerObjectService', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
            function ($scope, $stateParams,SellerObjectService) {
                $scope.seller = SellerObjectService.getSelectedSeller();
                $scope.movie = SellerObjectService.getSelectedMovie();
                var trailer = $scope.movie.trailer_link;
                trailer = trailer.split("=")[1];
                $scope.movie.trailer_link = "http://www.youtube.com/embed/" + trailer + "?rel=0&autoplay=true";
            }])
        .controller('sellerForm1Controller', ['$scope', '$stateParams', '$state', '$http', 'SellerObjectService', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
            function ($scope, $stateParams, $state,$http, SellerObjectService) {
                $scope.citiesList = [
                    {
                        "key": "none",
                        "value": ""
                    },
                    {
                        "key": "hyd",
                        "value": "Hyderabad"
                    },
                    {
                        "key": "chennai",
                        "value": "Chennai"
                    },
                    {
                        "key": "bangalore",
                        "value": "Bangalore"
                    }
                ];
                $http.get("https://sheltered-wave-68112.herokuapp.com/cities")
                        .then(function (response) {
                            //alert(JSON.stringify(response));
                            var temp = response.data;
                            for(var i=0;i<temp.length;i++){
                                temp[i].key = temp[i].name;
                                temp[i].value = temp[i].name;
                            }
                            $scope.citiesList = temp;
                        });
                $scope.onCitySelection = function(city){
                     //alert(JSON.stringify(city));
                     var url = "https://sheltered-wave-68112.herokuapp.com/halls/location/"+city;
                     $http.get(url)
                        .then(function (response) {
                            //alert(JSON.stringify(response));
                            var temp = response.data;
                            for(var i=0;i<temp.length;i++){
                                temp[i].key = temp[i].name;
                                temp[i].value = temp[i].name;
                            }
                            $scope.hallsList = temp;
                        });
                };
                $scope.hallsList = [
                    {
                        "key": "none",
                        "value": ""
                    },
                    {
                        "key": "1",
                        "value": "Hall1"
                    },
                    {
                        "key": "2",
                        "value": "Hall2"
                    },
                    {
                        "key": "3",
                        "value": "Hall3"
                    }
                ];
                $scope.languagesList = [
                    {
                        "key": "none",
                        "value": ""
                    },
                    {
                        "key": "TELUGU",
                        "value": "TELUGU"
                    },
                    {
                        "key": "HINDI",
                        "value": "HINDI"
                    },
                    {
                        "key": "ENGLISH",
                        "value": "ENGLISH"
                    }
                ];
                $scope.basicDetails = {
                    "city": "",
                    "hallName": "",
                    "language": "",
                    "movieName": ""
                };
                $scope.form = {
                    selectedLanguage: "none",
                    selectedHall: "none",
                    selectedCity: "none"
                };
                $scope.form.errMessage = "";
                $scope.form2PublishClick = function () {
                    //alert(JSON.stringify(data));
                    if ($scope.form.selectedCity === "none") {
                        $scope.form.errMessage = "Pleasen select city."
                        return;
                    }
                    if ($scope.form.selectedHall === "none") {
                        $scope.form.errMessage = "Pleasen select hall."
                        return;
                    }
                    if ($scope.form.selectedLanguage === "none") {
                        $scope.form.errMessage = "Pleasen select language."
                        return;
                    }
                    $scope.form.errMessage = "";
                    var data = SellerObjectService.getSellerObject();
                    data.language = $scope.form.selectedLanguage;
                    data.city = $scope.form.selectedCity;
                    data.hallName = $scope.form.selectedHall;
                    data.movieName = SellerObjectService.getSelectedMovie().name;
                    data.movie_id = SellerObjectService.getSelectedMovie()._id;
                    for(var i=0;i<$scope.hallsList.length;i++){
                        if($scope.hallsList[i].name === $scope.form.selectedHall){
                            data.hall_id = $scope.hallsList[i]._id;
                        }
                    }
                    SellerObjectService.setSellerObject(data);
                    $state.go('menu.sellDetailsForm2');
                };
            }])
        .controller('sellerForm2Controller', ['$scope', '$stateParams', '$state', '$ionicPopup', '$ionicHistory', '$http', '$ionicLoading', '$cordovaDatePicker', 'SellerObjectService', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
            function ($scope, $stateParams, $state, $ionicPopup, $ionicHistory, $http, $ionicLoading, $cordovaDatePicker, SellerObjectService) {
                // When button is clicked, the popup will be shown...
                $scope.selectDate = function () {
                    var options = {
                        date: new Date(),
                        mode: 'date', // or 'time'
                        minDate: new Date() - 10000,
                        allowOldDates: true,
                        allowFutureDates: false,
                        doneButtonLabel: 'DONE',
                        doneButtonColor: '#F2F3F4',
                        cancelButtonLabel: 'CANCEL',
                        cancelButtonColor: '#000000'
                    };
                    $cordovaDatePicker.show(options, function (date) {
                        //alert("date result " + date);
                    });
                };
                $scope.form = {
                    numberOfTickets: "",
                    amount: "",
                    selectedChoice: "",
                    date: "",
                    mobile: "",
                    errMessage: ""
                };
                $scope.showTimes = {
                    showText: "Choose Show Time",
                    choices: [
                        {
                            id: 1,
                            text: "11:15"
                        },
                        {
                            id: 2,
                            text: "02:15"
                        },
                        {
                            id: 3,
                            text: "06:15"
                        }
                    ]
                };
                $scope.showPopup = function () {
                    //alert(JSON.stringify($scope.showTimes));
                    if ($scope.form.numberOfTickets === "") {
                        $scope.form.errMessage = "Please enter number of Tickets.";
                        return;
                    }
                    if ($scope.form.amount === "") {
                        $scope.form.errMessage = "Please enter amount.";
                        return;
                    }
                    if ($scope.form.date === "") {
                        $scope.form.errMessage = "Please enter Date.";
                        return;
                    }
                    /*if($scope.form.mobile === ""){
                     $scope.form.errMessage = "Please enter mobile number.";
                     return;
                     }*/
                    if ($scope.form.selectedChoice === "") {
                        $scope.form.errMessage = "Please select show time.";
                        return;
                    }
                    $scope.form.errMessage = "";
                    var data = SellerObjectService.getSellerObject();
                    data.tickets = $scope.form.numberOfTickets;
                    data.price = $scope.form.amount;
                    data.date = $scope.form.date;
                    data.showTime = $scope.form.selectedChoice;
                    SellerObjectService.setSellerObject(data);
                    $state.go('menu.personalDetails');
                };
            }])
        .controller('OTPFormController', ['$scope', '$stateParams', '$state', '$ionicPopup', '$ionicHistory', '$http', '$ionicLoading', 'SellerObjectService', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
            function ($scope, $stateParams, $state, $ionicPopup, $ionicHistory, $http, $ionicLoading, SellerObjectService) {
                $scope.form = {
                    OTP: "",
                    isOTPCorrect: false,
                    errMessage: "",
                    color: "red",
                    allowPublish: true
                };
                $scope.form.mobile = "8501096987";
                $scope.OTP = SellerObjectService.getOTP();
                var uploadUrl = 'https://sheltered-wave-68112.herokuapp.com/email';
                var sendOTPData = {
                    "email": SellerObjectService.getSellerObject().email,
                    "OTP": $scope.OTP
                };
                var fd = new FormData();
                for (var key in sendOTPData)
                    fd.append(key, sendOTPData[key]);
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
                                alert("OTP sent successfully.");
                            }
                        });
                $scope.onOTPTextChange = function () {
                    if ($scope.form.OTP.length >= 5) {
                        if ($scope.form.OTP === $scope.OTP+"") {
                            $scope.form.isOTPCorrect = true;
                            $scope.form.errMessage = "";
                            var data = SellerObjectService.getSellerObject();
                            data.isMobileVerified = true;
                            SellerObjectService.setSellerObject(data);
                            $scope.form.color = "green";
                            $scope.form.errMessage = "Mobile Verified Successfully.";
                            $scope.form.allowPublish = false;
                        } else {
                            $scope.form.color = "red";
                            $scope.form.errMessage = "Please enter a valid OTP.";
                            $scope.form.allowPublish = true;
                        }
                    }
                };
                $scope.onOTPResendClick = function () {
                    $scope.form.OTP = "";
                    //sendOTP();
                };
                $scope.onPublichClick = function(){
                    var data = SellerObjectService.getSellerObject();
                    var send = {};
                    send.name = data.name;
                    send.movie_name = data.movieName;
                    send.movie_id = data.movie_id;
                    send.tickets = data.tickets;
                    send.price = data.price;
                    send.hall_name = data.hallName;
                    send.hall_id = data.hall_id;
                    send.location = data.city;
                    send.show_time = data.showTime;
                    send.mobile = data.mobile;
                    send.user_id = "DUMMY";
                    send.comments = data.comments;
                    send.date = data.date;
                    send.language = data.language;
                    send.email = data.email;
                    var fd = new FormData();
                    var uploadUrl = 'https://sheltered-wave-68112.herokuapp.com/sellers';
                    //alert("send"+JSON.stringify(send));
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
                                if(parseInt(status) === 200){
                                    $scope.showPopup();
                                }
                            });
                };
                $scope.showPopup = function () {
                    if (!$scope.form.isOTPCorrect) {
                        return;
                    }
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
                            template: '<p>Loading...</p><img src="img/loading.gif">'
                        });
                        $ionicHistory.nextViewOptions({
                            disableBack: true
                        });
                        $state.go('menu.home');
                        $ionicLoading.hide();
                        var data = SellerObjectService.getSellerObject();
                        //alert(JSON.stringify(data));
                        /*$http.get("http://services.groupkt.com/country/get/all").success(function (data) {
                         alert(JSON.stringify(data));
                         $ionicLoading.hide();
                         });*/

                    });
                };
            }])
        .controller('personalDetailsController', ['$scope', '$stateParams', '$state', 'SellerObjectService', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
            function ($scope, $stateParams, $state, SellerObjectService) {
                $scope.form = {
                    name: "",
                    email: "",
                    mobile: "",
                    errMessage: ""
                };
                $scope.personalDetailsNextClick = function () {
                    if ($scope.form.name === "") {
                        $scope.form.errMessage = "Please enter your name.";
                        return;
                    }
                    if ($scope.form.mobile === "") {
                        $scope.form.errMessage = "Please enter your mobile number.";
                        return;
                    }
                    if ($scope.form.mobile.length != 10) {
                        $scope.form.errMessage = "Please enter valid mobile number.";
                        return;
                    }
                    $scope.form.errMessage = "";
                    var data = SellerObjectService.getSellerObject();
                    data.name = $scope.form.name;
                    data.email = $scope.form.email;
                    data.mobile = $scope.form.mobile;
                    SellerObjectService.setSellerObject(data);
                    $state.go('menu.OTPForm');
                };
            }]);

 