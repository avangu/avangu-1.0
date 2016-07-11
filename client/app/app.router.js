'use strict';

// app.router.js
//angular.module('stannesiApp')
app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
});
