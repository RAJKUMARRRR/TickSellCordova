var sells = angular.module('app.sells', []);
sells.controller('sellerForm1Controller', ['$scope', '$stateParams', '$state', '$http', 'SellerObjectService',
    function ($scope, $stateParams, $state, $http, SellerObjectService) {
        $scope.citiesList = [
        ];
        $http.get("https://sheltered-wave-68112.herokuapp.com/cities")
                .then(function (response) {
                    //alert(JSON.stringify(response));
                    var temp = response.data;
                    for (var i = 0; i < temp.length; i++) {
                        temp[i].key = temp[i].name;
                        temp[i].value = temp[i].name;
                    }
                    $scope.citiesList = temp;
                });
        $scope.onCitySelection = function (city) {
            //alert(JSON.stringify(city));
            var url = "https://sheltered-wave-68112.herokuapp.com/halls/location/" + city;
            $http.get(url)
                    .then(function (response) {
                        //alert(JSON.stringify(response));
                        var temp = response.data;
                        for (var i = 0; i < temp.length; i++) {
                            temp[i].key = temp[i].name;
                            temp[i].value = temp[i].name;
                        }
                        $scope.hallsList = temp;
                    });
        };
        $scope.hallsList = [
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
            for (var i = 0; i < $scope.hallsList.length; i++) {
                if ($scope.hallsList[i].name === $scope.form.selectedHall) {
                    data.hall_id = $scope.hallsList[i]._id;
                }
            }
            SellerObjectService.setSellerObject(data);
            $state.go('menu.sellDetailsForm2');
        };
    }]);

sells.controller('sellerForm2Controller', ['$scope', '$stateParams', '$state', '$ionicPopup',
    '$ionicHistory', '$http', '$ionicLoading', '$cordovaDatePicker', 'SellerObjectService',
    function ($scope, $stateParams, $state, $ionicPopup, $ionicHistory, $http, $ionicLoading, $cordovaDatePicker, SellerObjectService) {
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
    }]);

sells.controller('personalDetailsController', ['$scope', '$stateParams', '$state', 'SellerObjectService',
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

sells.controller('OTPFormController', ['$scope', '$stateParams', '$state',
    '$ionicPopup', '$ionicHistory', '$http', '$ionicLoading', 'SellerObjectService',
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
                if ($scope.form.OTP === $scope.OTP + "") {
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
        $scope.onPublichClick = function () {
            var data = SellerObjectService.getSellerObject();
            var user_profile = SellerObjectService.getProfileObject();
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
            send.image_url = user_profile.imageUrl;
            send.timestamp = new Date();
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
                        if (parseInt(status) === 200) {
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
            });
        };
    }]);
