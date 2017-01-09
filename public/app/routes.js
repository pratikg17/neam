angular.module('appRoutes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {

    $routeProvider.when('/', {
            templateUrl: 'app/views/pages/home.html'
        })
        .when('/about', {
            templateUrl: 'app/views/pages/about.html'
        })
        .when('/register', {
            templateUrl: 'app/views/pages/users/register.html',
            controller: 'regCtrl',
            controllerAs: 'register'
        })
        .when('/login', {
            templateUrl: 'app/views/pages/users/login.html'

        })
        .when('/logout', {
            templateUrl: 'app/views/pages/users/logout.html'
        })
        .when('/profile', {
            templateUrl: 'app/views/pages/users/profile.html'

        })
        .when('/facebook/:token', {
            templateUrl: 'app/views/pages/users/socail/socail.html',
            controller: 'facebookCtrl',
            controllerAs: 'facebook'

        })
        .when('/twitter', {
            templateUrl: 'app/views/pages/users/socail/socail.html',
            controller: 'twitterCtrl',
            controllerAs: 'twitter'

        })
        .when('/google/:token', {
            templateUrl: 'app/views/pages/users/socail/socail.html',
            controller: 'googleCtrl',
            controllerAs: 'google'

        })

    .when('/facebookerror', {
            templateUrl: 'app/views/pages/users/login.html',
            controller: 'facebookCtrl',
            controllerAs: 'facebook'

        })
        .when('/twittererror', {
            templateUrl: 'app/views/pages/users/login.html',
            controller: 'twitterCtrl',
            controllerAs: 'twitter'

        })
        .when('/googleerror', {
            templateUrl: 'app/views/pages/users/login.html',
            controller: 'googleCtrl',
            controllerAs: 'google'

        })

    .otherwise({
        redirectTo: '/'
    });

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
})