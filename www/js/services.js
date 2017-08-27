angular.module('app.services', [])
        .factory('updateService', ['$http', function ($http) {
                var updateService = {};
                updateService.updateMovie = function (movie_id,data) {
                    var uploadUrl = 'https://sheltered-wave-68112.herokuapp.com/movies/movie_likes/' + movie_id;
                    var fd = new FormData();
                    for (var key in data)
                        fd.append(key, data[key]);
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
                                    //alert("Liked successfully." + JSON.stringify(response));
                                }
                            });
                };
                updateService.updateUser = function (user_id,data) {
                    var uploadUrl = 'https://sheltered-wave-68112.herokuapp.com/users/' + user_id;
                    var fd = new FormData();
                    for (var key in data)
                        fd.append(key, data[key]);
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
                                    //alert("Liked successfully." + JSON.stringify(response));
                                }
                            });
                };
                return updateService;
            }])
        .factory('utilities', ['$ionicLoading', function ($ionicLoading) {
                var utilities = {};
                utilities.showLoader = function () {
                    $ionicLoading.show({
                        // template: '<img src="img/loading.gif">'
                        templateUrl: "templates/Ripple.html",
                        noBackdrop: false
                    });
                };
                utilities.hideLoader = function () {
                    $ionicLoading.hide();
                };
                return utilities;
            }])
        .service('SellerObjectService', function () {
            this.selectedReview = {};
            this.getSelectedReview = function(){
              return this.selectedReview;  
            };
            this.setSelectedReview = function(review){
              this.selectedReview = review;
            };
            this.profileObject = null;
            this.formatProfileObject = function (object) {
                var profile = {};
                profile.name = object.displayName;
                profile.mobile = object.mobile;
                profile.email = object.email;
                profile.profile_image_url = object.imageUrl;
                profile.liked = object.liked;
                profile.disliked = object.disliked;
                profile.user_id = object.user_id;
                return profile;
            };
            this.getProfileObject = function(){
                return this.profileObject;
            };
            this.setProfileObject = function(profile){
                this.profileObject = profile;
            };
            this.getOTP = function(){
              var x = Math.floor((Math.random() * 99999) + 11111);
              return x;
            };
            this.selectedMovie = {
                
            };
            this.selectedSeller = {
            };
            this.getSelectedSeller = function(){
              return this.selectedSeller;  
            };
            this.setSelectedSeller = function(seller){
              this.selectedSeller = seller;  
            };
            this.setSelectedMovie = function(movie){
                this.selectedMovie = movie;
            };
            this.getSelectedMovie = function(){
              return this.selectedMovie;  
            };
            this.sellerObject = {
                "name": "",
                "movieName": "",
                "movie_id":"",
                "showTime": "",
                "hallName": "",
                "hall_id":"",
                "mobile": "",
                "tickets": "",
                "price": "",
                "comments": "Not Implemented",
                "language": "",
                "date": "",
                "city": "",
                "email": "",
                "isMobileVerified": false
            };
            this.setSellerObject = function (newSellerObject) {
                this.sellerObject = newSellerObject;
            };
            this.getSellerObject = function () {
                return this.sellerObject;
            };
        })
        .service('MoviesList', function () {
            this.movies = [
                {
                    "id":"100",
                    "name":"Fidaa",
                    "screen":"2-D",
                    "certificate":"U",
                    "language":"Telugu",
                    "isReleased": false,
                    "img":"img/fidaa.jpg"
                },
                {
                    "id":"200",
                    "name":"Spiderman:Coming Home",
                    "screen":"3-D",
                    "certificate":"UA",
                    "language":"English",
                    "isReleased": true,
                    "img":"img/spdmhc.jpg"
                },
                {
                    "id":"300",
                    "name":"Ninnu Kori",
                    "screen":"2-D",
                    "certificate":"U",
                    "language":"Telugu",
                    "isReleased": true,
                    "img":"img/ninnukori.jpg"
                },
                {
                    "id":"400",
                    "name":"War for the Planet of the Apes",
                    "screen":"3-D",
                    "certificate":"UA",
                    "language":"English",
                    "isReleased": true,
                   "img":"img/wftpoa.jpg"
                },
                {
                    "id":"500",
                    "name":"Patel S.I.R",
                    "screen":"2-D",
                    "certificate":"UA",
                    "language":"Telugu",
                    "isReleased": true,
                    "img":"img/patelsir.jpg"
                },
                {
                    "id":"600",
                    "name":"Shamantakamani",
                    "screen":"2-D",
                    "certificate":"U",
                    "language":"Telugu",
                    "isReleased": true,
                    "img":"img/shamantakamani.jpg"
                },
                {
                    "id":"700",
                    "name":"Jagga Jasoos",
                    "screen":"2-D",
                    "certificate":"UA",
                    "language":"Hindi",
                    "isReleased": true,
                    "img":"img/jagoojas.jpg"
                }
            ];
            this.getMoviesList = function () {
                return this.movies;
            };
        })
        .service('BlankService', [function () {

            }])
//var googleLoginService = angular.module('GoogleLoginService', ['ngStorage']);
        .factory('timeStorage', [ function ($localStorage) {
        var timeStorage = {};
        timeStorage.cleanUp = function () {
            $localStorage.$reset();
        };
        timeStorage.remove = function (key) {
           delete $localStorage[key];
        };
        timeStorage.set = function (key, data) {
            $localStorage[key] = data;
        };
        timeStorage.get = function (key) {
            return $localStorage[key];
        };
        return timeStorage;
    }])


.factory('googleLogin', [
    '$http', '$q', '$interval', '$log', 'timeStorage',
    function ($http, $q, $interval, $log, timeStorage) {
        var service = {};
        service.access_token = false;
        service.redirect_url = 'http://localhost:8383';
        service.client_id = '354839977005-skkk3u1qa51l6tu5dfiu8ae87bh0sk4r.apps.googleusercontent.com';
        service.secret = '7zv4MOvZXtz9-ecsio6Zy8qC';
        service.scope = 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/plus.me';
        service.gulp = function (url, name) {
            url = url.substring(url.indexOf('?') + 1, url.length);

            return url.replace('code=', '');

//            name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
//            var regexS = "[\\#&]" + name + "=([^&#]*)";
//            var regex = new RegExp(regexS);
//            var results = regex.exec(url);
//            if (results == null)
//                return "";
//            else
//                return results[1];

//            var match,
//                    pl = /\+/g, // Regex for replacing addition symbol with a space
//                    search = /([^&=]+)=?([^&]*)/g,
//                    decode = function (s) {
//                        return decodeURIComponent(s.replace(pl, " "));
//                    },
//                    query = url;
//
//            var urlParams = {};
//            while (match = search.exec(query))
//                urlParams[decode(match[1])] = decode(match[2]);
//
//            if (urlParams.name) {
//                return urlParams.name;
//            } else {
//                return false;
//            }

        };
        service.authorize = function (options) {
            var def = $q.defer();
            var self = this;

            var access_token = timeStorage.get('google_access_token');
            if (access_token) {
                $log.info('Direct Access Token :' + access_token);
                service.getUserInfo(access_token, def);
            } else {

                var params = 'client_id=' + encodeURIComponent(options.client_id);
                params += '&redirect_uri=' + encodeURIComponent(options.redirect_uri);
                params += '&response_type=code';
                params += '&scope=' + encodeURIComponent(options.scope);
                var authUrl = 'https://accounts.google.com/o/oauth2/auth?' + params;

                var win = window.open(authUrl, '_blank', 'location=no,toolbar=no,width=800, height=800');
                var context = this;

                if (ionic.Platform.isWebView()) {
                    console.log('using in app browser');
                    win.addEventListener('loadstart', function (data) {
                        console.log('load start');
                        if (data.url.indexOf(context.redirect_url) === 0) {
                            console.log('redirect url found ' + context.redirect_url);
                            console.log('window url found ' + data.url);
                            win.close();
                            var url = data.url;
                            var access_code = context.gulp(url, 'code');
                            if (access_code) {
                                context.validateToken(access_code, def);
                            } else {
                                def.reject({error: 'Access Code Not Found'});
                            }
                        }

                    });
                } else {
                    console.log('InAppBrowser not found11');
                    var pollTimer = $interval(function () {
                        try {
                            console.log("google window url " + win.document.URL);
                            if (win.document.URL.indexOf(context.redirect_url) === 0) {
                                console.log('redirect url found');
                                win.close();
                                $interval.cancel(pollTimer);
                                pollTimer = false;
                                var url = win.document.URL;
                                $log.debug('Final URL ' + url);
                                var access_code = context.gulp(url, 'code');
                                if (access_code) {
                                    $log.info('Access Code: ' + access_code);
                                    context.validateToken(access_code, def);
                                } else {
                                    def.reject({error: 'Access Code Not Found'});
                                }
                            }
                        } catch (e) {
                        }
                    }, 100);
                }
            }
            return def.promise;
        };
        service.validateToken = function (token, def) {
            $log.info('Code: ' + token);
            var http = $http({
                url: 'https://www.googleapis.com/oauth2/v3/token',
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                params: {
                    code: token,
                    client_id: this.client_id,
                    client_secret: this.secret,
                    redirect_uri: this.redirect_url,
                    grant_type: 'authorization_code',
                    scope: ''
                }
            });
            var context = this;
            http.then(function (data) {
                $log.debug(data);
                var access_token = data.data.access_token;
                var expires_in = data.data.expires_in;
                expires_in = expires_in * 1 / (60 * 60);
                timeStorage.set('google_access_token', access_token, expires_in);
                if (access_token) {
                    $log.info('Access Token :' + access_token);
                    context.getUserInfo(access_token, def);
                } else {
                    def.reject({error: 'Access Token Not Found'});
                }
            });
        };
        service.getUserInfo = function (access_token, def) {
            var http = $http({
                url: 'https://www.googleapis.com/oauth2/v3/userinfo',
                method: 'GET',
                params: {
                    access_token: access_token
                }
            });
            http.then(function (data) {
                $log.debug(data);
                var user_data = data.data;
                var user = {
                    name: user_data.name,
                    gender: user_data.gender,
                    email: user_data.email,
                    google_id: user_data.sub,
                    picture: user_data.picture,
                    profile: user_data.profile
                };
                def.resolve(user);
            });
        };
        service.getUserFriends = function () {
            var access_token = this.access_token;
            var http = $http({
                url: 'https://www.googleapis.com/plus/v1/people/me/people/visible',
                method: 'GET',
                params: {
                    access_token: access_token
                }
            });
            http.then(function (data) {
                console.log(data);
            });
        };
        service.startLogin = function () {
            var def = $q.defer();
            var promise = this.authorize({
                client_id: this.client_id,
                client_secret: this.secret,
                redirect_uri: this.redirect_url,
                scope: this.scope
            });
            promise.then(function (data) {
                def.resolve(data);
            }, function (data) {
                $log.error(data);
                def.reject(data.error);
            });
            return def.promise;
        };
        return service;
    }
]);