angular.module("userControllers", ['userServices'])

.controller('regCtrl', function($http, $location, $timeout, User) {

        var app = this;
        this.regUser = function(regData, valid) {
            app.loading = true;
            app.errorMsg = false;
            app.successMsg = false;
            if (valid) {
                User.create(app.regData).then(function(data) {

                    if (data.data.success) {
                        //Create success
                        app.loading = false;
                        app.successMsg = data.data.message + '....Redirecting';

                        $timeout(function() {
                            $location.path('/');
                        }, 2000);


                    } else {
                        // Create Error message
                        app.loading = false;
                        app.errorMsg = data.data.message;
                    }

                });
            } else {
                app.loading = false;
                app.errorMsg = "Please Ensure the Form is filled properly";
            }

        };
        this.checkUsername = function(regData) {
            User.checkUsername(app.regData).then(function(data) {
                app.usernameMsg = false;
                app.usernameInvalid = false;
                app.checkingusername = true;

                if (data.data.success) {
                    app.checkingusername = false;
                    app.usernameInvalid = false;
                    app.usernameMsg = data.data.message;
                } else {
                    app.checkingusername = false;
                    app.usernameInvalid = true;
                    app.usernameMsg = data.data.message;
                }
            });

        };

        this.checkEmail = function(regData) {
            User.checkEmail(app.regData).then(function(data) {
                app.emailMsg = false;
                app.emailInvalid = false;
                app.checkingemail = true;

                if (data.data.success) {
                    app.checkingemail = false;
                    app.emailInvalid = false;
                    app.emailMsg = data.data.message;
                } else {
                    app.checkingemail = false;
                    app.emailInvalid = true;
                    app.emailMsg = data.data.message;
                }
            });

        };
    })
    .directive('match', function() {
        return {
            restrict: 'A',
            controller: function($scope) {

                $scope.confirmed = false;
                $scope.doConfirm = function(values) {
                    console.log("VALUES", values);
                    values
                        .forEach(function(ele) {
                            console.log(ele);
                            if ($scope.confirm == values) {

                                $scope.confirmed = true;

                                console.log("ELE  TRUE", $scope.confirmed);
                            } else {
                                $scope.confirmed = false;
                                console.log("ELSE  FALSE", $scope.confirmed);

                            }
                        });
                }
            },
            link: function(scope, element, attrs, $scope) {
                attrs
                    .$observe('match', function() {
                        scope.matches = JSON.parse(attrs.match);
                        scope.doConfirm(scope.matches);
                    });
                scope.$watch('confirm', function() {
                    console.log($scope.confirm);
                    scope.matches = JSON.parse(attrs.match);
                    scope.doConfirm(scope.matches);
                });
            }
        }
    })

.controller('facebookCtrl', function($routeParams, Auth, $location, $window) {
        var app = this;
        if ($window.location.pathname == '/facebookerror') {
            //error 
            app.errorMsg = "Facebook email not found in database";
        } else {
            Auth.facebook($routeParams.token);
            $location.path('/');
        }

    })
    .controller('twitterCtrl', function($routeParams, Auth, $location, $window) {
        var app = this;
        if ($window.location.pathname == '/twittererror') {
            //error 
            app.errorMsg = "twitter email not found in database";
        } else {

            Auth.twitter($routeParams.token);
            $location.path('/');
        }

    })
    .controller('googleCtrl', function($routeParams, Auth, $location, $window) {
        var app = this;
        if ($window.location.pathname == '/googleerror') {
            //error 
            app.errorMsg = "Google email not found in database";
        } else {

            Auth.google($routeParams.token);
            $location.path('/');
        }

    });