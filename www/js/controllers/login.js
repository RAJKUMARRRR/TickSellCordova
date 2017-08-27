var login = angular.module('app.login', []);
login.controller('loginController', ['$scope', '$stateParams', '$state', 'SellerObjectService', '$cordovaOauth', 'timeStorage', '$http', '$ionicHistory', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
    function ($scope, $stateParams, $state, SellerObjectService, $cordovaOauth, timeStorage, $http, $ionicHistory) {
        $scope.onGoogleLoginClick = function () {
            window.plugins.googleplus.login(
                    {},
                    function (obj) {
                        //alert("Success:" + JSON.stringify(obj));
                        /*SellerObjectService.setProfileObject(obj);
                        $ionicHistory.nextViewOptions({
                            disableBack: true
                        });
                        $state.go('menu.home');*/
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
        $scope.skipOnClick = function () {
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
                    /*$ionicHistory.nextViewOptions({
                        disableBack: true
                    });
                    $state.go('menu.home');*/
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
                            //alert("User added successfully." + JSON.stringify(response));
                            $scope.getProfile(profile.email);
                        }
                    });
        };
        $scope.getProfile = function (email) {
            $http.get("https://sheltered-wave-68112.herokuapp.com/users/email/" + email)
                    .then(function (response) {
                        //alert("inside get profile:"+JSON.stringify(response));
                        var profile = response.data[0];
                        var profile_data = {};
                        profile_data.imageUrl = profile.profile_image_url;
                        profile_data.displayName = profile.name;
                        profile_data.email = profile.email;
                        profile_data.mobile = profile.mobile;
                        profile_data.liked = profile.liked;
                        profile_data.disliked = profile.disliked;
                        profile_data.user_id = profile._id;
                        SellerObjectService.setProfileObject(profile_data);
                        $ionicHistory.nextViewOptions({
                            disableBack: true
                        });
                        $state.go('menu.home');
                    });
        };
        $scope.login = {};
        $scope.login.email = "";
        $scope.login.password = "";
        $scope.onLoginClick = function () {
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
                                profile_data.mobile = profile.mobile;
                                profile_data.liked = profile.liked;                                
                                profile_data.disliked = profile.disliked;
                                profile_data.user_id = profile._id;
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
    }]);
