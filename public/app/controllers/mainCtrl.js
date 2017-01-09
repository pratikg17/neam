angular
    .module('mainController', ['authServices'])
    .controller('mainCtrl', function(Auth, $timeout, $location, $rootScope, $window) {

        var app = this;
        app.loadme = false;
        $rootScope.$on('$routeChangeStart', function() {

            if (Auth.isLoggedIn()) {

                app.isLoggedIn = true;
                Auth
                    .getUser()
                    .then(function(data) {

                        app.username = data.data.username;
                        app.useremail = data.data.email;
                        app.loadme = true;
                    });

            } else {

                app.isLoggedIn = false;
                app.username = "";
                app.loadme = true;
            }
            if ($location.hash() == '_=_') $location.hash(null);


        });

        this.doLogin = function() {

            app.loading = true;
            app.errorMsg = false;
            app.successMsg = false;

            Auth
                .login(app.loginData)
                .then(function(data) {

                    if (data.data.success) {
                        //Create success
                        app.loading = false;
                        app.successMsg = data.data.message + '....Redirecting';

                        $timeout(function() {
                            $location.path('/about');
                            app.loginData = "";
                            app.successMsg = false;
                        }, 2000);

                    } else {
                        // Create Error message
                        app.loading = false;
                        app.errorMsg = data.data.message;
                    }

                });
        };


        this.facebook = function() {
            // console.log($window.location.host); //localhost:8080
            // console.log($window.location.protocol); //http:

            $window.location = $window.location.protocol + '//' + $window.location.host + '/auth/facebook';
        };

        this.twitter = function() {
            // console.log($window.location.host); //localhost:8080
            // console.log($window.location.protocol); //http:

            $window.location = $window.location.protocol + '//' + $window.location.host + '/auth/twitter';
        };

        this.google = function() {
            // console.log($window.location.host); //localhost:8080
            // console.log($window.location.protocol); //http:

            $window.location = $window.location.protocol + '//' + $window.location.host + '/auth/google';
        };



        this.logout = function() {
            Auth.logout();
            $location.path('/logout');
            $timeout(function() {
                $location.path('/');
            }, 2000);
        }

    });