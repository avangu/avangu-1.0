// 'use strict';

angular.module("avangu.plugins.controls")
    // cache video template 
    .run(["$templateCache",
        // save fullscreen template to cache
        function ($templateCache) {
            $templateCache.put("avgu-templates/avgu-controls-btn-fullscreen",
                '<button class="icon" ng-click="toggleFullscreen()" aria-label="fullscreen"><span class="icon fullscreen" ng-class="avguClass"><span></button>'
            );
        }
     ])

    /* avangu fullscreen controls plugin directive */
    .directive("avanguButtonFullscreen", ["$timeout", "$AVGU_STATES", function($timeout, $AVGU_STATES) {
        return {
            restrict: "E", 
            require: "^avangu",
            replace: true,
            
            templateUrl: function(elem, attrs) {
                // return fullscreen template from cache
                return "avgu-templates/avgu-controls-btn-fullscreen"
            },
            
            scope: {},
            
           /**
             * angular directive link method
             *
             * @method link
             * @param {object} scope
             * @param {object} elem
             * @param {object} attrs
             * @param {object} $API
             * @return {void}
             */
            link: function(scope, elem, attrs, $API) {
                var player = $API;
                
                scope.setState = function ( val ) {
                    if ( val ) {
                        scope.avguClass = "exit";
                    } else {
                        scope.avguClass = "";
                    }
                };

                scope.toggleFullscreen = function() {
                    player.toggleFullscreen();
                    scope.setState(player.isFullscreen);
                };
                
                scope.$watch()(
                    function() {
                        return player.isFullscreen;
                    },
                    function() {
                        if (newVal != oldVal) {
                            scope.setState(newVal)
                        }
                    }
                );
                // set default buttton state
                scope.setState(player.state);
                
                console.log(".::: avangu player controls plugin fullscreen Button  :::.", player.state);
            }
        }
    }]
);