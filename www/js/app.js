angular.module('ionicApp', ['ionic'])

    .config(function($stateProvider, $urlRouterProvider, $httpProvider) {

        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];

        $stateProvider
            .state('signin', {
                url: "/sign-in",
                templateUrl: "sign-in.html",
                controller: 'SignInCtrl'
            })
            .state('forgotpassword', {
                url: "/forgot-password",
                templateUrl: "forgot-password.html"
            })
            .state('register', {
                url: "/register",
                templateUrl: "register.html",
                controller: 'SignInCtrl'
            })
            .state('tabs', {
                url: "/tab",
                abstract: true,
                templateUrl: "tabs.html"
            })
            .state('tabs.home', {
                url: "/home",
                views: {
                    'home-tab': {
                        templateUrl: "home.html",
                        controller: 'HomeTabCtrl'
                    }
                }
            })
            .state('tabs.facts', {
                url: "/facts",
                views: {
                    'home-tab': {
                        templateUrl: "facts.html"
                    }
                }
            })
            .state('tabs.sell', {
                url: "/sell",
                views: {
                    'sell-tab': {
                        templateUrl: "sell.html"
                    }
                }
            })
            .state('tabs.facts2', {
                url: "/facts2",
                views: {
                    'home-tab': {
                        templateUrl: "facts2.html"
                    }
                }
            })
            .state('tabs.messages', {
                url: "/messages",
                views: {
                    'messages-tab': {
                        templateUrl: "messages.html"
                    }
                }
            })
            .state('tabs.myroom', {
                url: "/myroom",
                views: {
                    'myroom-tab': {
                        templateUrl: "myroom.html"
                    }
                }
            })
            .state('tabs.reserved', {
                url: "/reserved",
                views: {
                    'myroom-tab': {
                        templateUrl: "reserved.html"
                    }
                }
            })
            .state('tabs.transact', {
                url: "/transact",
                views: {
                    'myroom-tab': {
                        templateUrl: "transact.html"
                    }
                }
            })
            .state('tabs.navstack', {
                url: "/navstack",
                views: {
                    'about-tab': {
                        templateUrl: "nav-stack.html"
                    }
                }
            })
            .state('tabs.contact', {
                url: "/contact",
                views: {
                    'contact-tab': {
                        templateUrl: "contact.html"
                    }
                }
            });

        $urlRouterProvider.otherwise("/sign-in");

    })

    .controller('SignInCtrl', function($scope, $state) {

        $scope.signIn = function(user) {
            //console.log('Sign-In', user);
            $state.go('tabs.home');
        };
    })

    .controller('HomeTabCtrl', function($scope, $rootScope, $ionicModal, $http) {
        $rootScope.name = "Couch";

        $ionicModal.fromTemplateUrl('new-task.html', function(modal) {
            $scope.taskModal = modal;
        }, {
            scope: $scope
        });

        $scope.showCatergories = function() {
            $scope.taskModal.show();
        };

        $scope.closeNewTask = function() {
            $scope.taskModal.hide();
        };

        $scope.createTask = function(catergory) {
            $scope.taskModal.show();
        };

        var url = "http://localhost:8080/";

        $http.get(url).
            success(function(data, status, headers, config) {
                //what do I do here?
                displayData(data);
            }).
            error(function(data, status, headers, config) {
                $scope.error = true;
                console.log(data);
        });

        displayData = function(dataObj){
            $scope.itemListings = dataObj;
        };
    });