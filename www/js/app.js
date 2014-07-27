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
            .state('tabs.furniture', {
                url: "/furniture",
                views: {
                    'home-tab': {
                        templateUrl: "furniture.html",
                        controller: 'HomeTabCtrl'
                    }
                }
            })
            .state('tabs.facts', {
                url: "/facts",
                views: {
                    'home-tab': {
                        templateUrl: "facts.html",
                        controller: 'factsCtrl'
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

        $scope.signIn = function() {
            $state.go('tabs.home');
        };
    })

    .controller('HomeTabCtrl', function($scope, $rootScope, $ionicModal, $http, $state) {
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

        $scope.itemClicked = function(id){
            $rootScope.itemPic = $scope.itemListings[id].itemPic;
            $rootScope.itemname = $scope.itemListings[id].itemTitle;
            $rootScope.itemDetails = $scope.itemListings[id].itemDetails;
            $rootScope.itemDescription = $scope.itemListings[id].itemDescription;
            $rootScope.itemPrice = $scope.itemListings[id].itemPrice;
        };

        $scope.selectCategory = function() {
            $scope.taskModal.hide();
            $state.go('tabs.furniture');
        };

        var url = "http://localhost:8080/";

        $http.get(url).
            success(function(data, status, headers, config) {
                displayData(data);
            }).
            error(function(data, status, headers, config) {
                $scope.error = true;
                console.log(data);
        });

        displayData = function(dataObj){
            $scope.itemListings = dataObj;
        };
    })

    .controller('factsCtrl', function($scope, $rootScope, $timeout, $ionicLoading) {
        $scope.showLoading = function(Text) {
            $scope.loadingIndicator = $ionicLoading.show({
                content: 'Item '+Text+"!",
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 500
            });

            $timeout(function(){
                $scope.loadingIndicator.hide();
            },2000);
        }
    });