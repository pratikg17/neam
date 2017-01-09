angular.module('userApp', ['appRoutes', 'mainController', 'userControllers', 'userServices', 'authServices', 'ngAnimate'])


.config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
});