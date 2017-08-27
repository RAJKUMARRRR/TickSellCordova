/*angular.module('app.routes', [])

        .config(function ($stateProvider, $urlRouterProvider) {

            // Ionic uses AngularUI Router which uses the concept of states
            // Learn more here: https://github.com/angular-ui/ui-router
            // Set up the various states which the app can be in.
            // Each state's controller can be found in controllers.js
            $stateProvider
                   .state('menu.home', {
                        url: '/page1',
                        views: {
                            'side-menu21': {
                                templateUrl: 'templates/home.html',
                                controller: 'homeCtrl'
                            }
                        }
                    })

                    .state('menu.sellersList', {
                        url: '/page2',
                        views: {
                            'side-menu21': {
                                templateUrl: 'templates/sellersList.html',
                                controller: 'sellersListCtrl'
                            }
                        }
                    })
                    .state('menu.cloud', {
                        url: '/page3',
                        views: {
                            'side-menu21': {
                                templateUrl: 'templates/cloud.html',
                                controller: 'cloudCtrl'
                            }
                        }
                    })

                    .state('menu', {
                        url: '/side-menu21',
                        templateUrl: 'templates/menu.html',
                        controller: 'menuCtrl'
                    })
                    .state('menu.selletDetails', {
                        url: '/sellerDetailsId',
                        views: {
                            'side-menu21': {
                                templateUrl: 'templates/sellerDetails.html',
                                controller: 'sellerDetailsController'
                            }
                        }
                    })
                    .state('menu.sellDetailsForm1', {
                        url: '/DetailsEntry1',
                        views: {
                            'side-menu21': {
                                templateUrl: 'templates/sellerForm1.html',
                                controller: 'sellerForm1Controller'
                            }
                        }
                    })
                    .state('menu.sellDetailsForm2', {
                        url: '/DetailsEntry2',
                        views: {
                            'side-menu21': {
                                templateUrl: 'templates/sellerForm2.html',
                                controller: 'sellerForm2Controller'
                            }
                        }
                    })
                    .state('menu.OTPForm', {
                        url: '/OTPForm',
                        views: {
                            'side-menu21': {
                                templateUrl: 'templates/OTPForm.html',
                                controller: 'OTPFormController'
                            }
                        }
                    })
                    .state('menu.personalDetails', {
                        url: '/personalDetails',
                        views: {
                            'side-menu21': {
                                templateUrl: 'templates/personalDetails.html',
                                controller: 'personalDetailsController'
                            }
                        }
                    })

            $urlRouterProvider.otherwise('/side-menu21/page1')


        });*/
angular.module('app.routes', [])
.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  
                   .state('menu', {
                        url: '/menu',
                        abstract: true,
                        templateUrl: 'templates/menu.html'
                    })
                   .state('login', {
                        url: '/login',
                        templateUrl: 'templates/login.html',
                        controller: 'loginController'
                    })                    
                   .state('menu.login', {
                        url: '/page_login',
                        views: {
                            'side-menu21': {
                                templateUrl: 'templates/login.html',
                                controller: 'loginController'
                            }
                        }
                    })
                   .state('menu.home', {
                        url: '/page1',
                        views: {
                            'side-menu21': {
                                templateUrl: 'templates/home.html',
                                controller: 'movies_home'
                            }
                        }
                    })
                   .state('menu.reviews', {
                        url: '/page_reviews',
                        cache: false,
                        views: {
                            'side-menu-reviews': {
                                templateUrl: 'templates/reviews.html',
                                controller: 'reviewsController'
                            }
                        }
                    })
                   .state('menu.review_add', {
                        url: '/page_review_add',
                        views: {
                            'side-menu-reviews': {
                                templateUrl: 'templates/add_review.html',
                                controller: 'addReviewController'
                            }
                        }
                    })
                   .state('menu.reviews_list', {
                        url: '/page_reviews_list',
                        views: {
                            'side-menu-reviews': {
                                templateUrl: 'templates/reviews_list.html',
                                controller: 'reviewListController'
                            }
                        }
                    })
                   .state('menu.review_details', {
                        url: '/page_review_details',
                        views: {
                            'side-menu-reviews': {
                                templateUrl: 'templates/review_details.html',
                                controller: 'reviewDetailsController'
                            }
                        }
                    })
                    .state('menu.sellersList', {
                        url: '/page2',
                        views: {
                            'side-menu21': {
                                templateUrl: 'templates/sellersList.html',
                                controller: 'sellersListCtrl'
                            }
                        }
                    })
                    .state('menu.profile', {
                        url: '/page3',
                        cache: false,
                        views: {
                            'side-menu-trailers': {
                                templateUrl: 'templates/profile.html',
                                controller: 'profileCtrl'
                            }
                        }
                    })
                    .state('selletDetails', {
                        url: '/sellerDetailsId',
                        cache: false,
                        templateUrl: 'templates/sellerDetails.html',
                        controller: 'sellerDetailsController'
                    })
                    .state('menu.selletDetails', {
                        url: '/sellerDetailsId',
                        views: {
                            'side-menu21': {
                                templateUrl: 'templates/sellerDetails.html',
                                controller: 'sellerDetailsController'
                            }
                        }
                    })
                    .state('menu.sellDetailsForm1', {
                        url: '/DetailsEntry1',
                        views: {
                            'side-menu21': {
                                templateUrl: 'templates/sellerForm1.html',
                                controller: 'sellerForm1Controller'
                            }
                        }
                    })
                    .state('menu.sellDetailsForm2', {
                        url: '/DetailsEntry2',
                        views: {
                            'side-menu21': {
                                templateUrl: 'templates/sellerForm2.html',
                                controller: 'sellerForm2Controller'
                            }
                        }
                    })
                    .state('menu.OTPForm', {
                        url: '/OTPForm',
                        views: {
                            'side-menu21': {
                                templateUrl: 'templates/OTPForm.html',
                                controller: 'OTPFormController'
                            }
                        }
                    })
                    .state('menu.personalDetails', {
                        url: '/personalDetails',
                        views: {
                            'side-menu21': {
                                templateUrl: 'templates/personalDetails.html',
                                controller: 'personalDetailsController'
                            }
                        }
                    });


  // if none of the above states are matched, use this as the fallback
$urlRouterProvider.otherwise('/login');

});
