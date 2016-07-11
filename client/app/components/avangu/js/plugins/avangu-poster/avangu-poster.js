'use strict';

angular.module("avangu.plugins")
    // cache video template 
    .run(["$templateCache",
        // save poster template to cache
        function ($templateCache) {
            $templateCache.put("avgu-templates/avgu-plugin-poster",
                '<img ng-src={{url}} class="{{class}}">'
            );
        }
     ])

    /* avangu poster plugin directive */
    .directive("avanguPoster", ["$AVGU_STATES", function($AVGU_STATES) {
        return {
            restrict: "E", 
            require: "^avangu",
            
            templateUrl: function(elem, attrs) {
                // return poster template from cache
                return  "avgu-templates/avgu-plugin-poster"
            },
            
            scope: {
                url: "@"
            },
            
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

                if (player.type === "video") {
                    
                    scope.showHide = function ( state ) {
                        switch ( state ) {
                            case $AVGU_STATES.PLAY:
                            case $AVGU_STATES.PAUSE:
                                scope.class = "hide";
                                break;
                            case $AVGU_STATES.STOP:
                                scope.class = "show";
                                break;
                        }
                    }
                    
                    /*
                    scope.setPoster = function (newUrl, oldUrl) {   
                       if (( newUrl != oldUrl) && newUrl ) {
                            player.playerElement.poster = newUrl;
                       }
                        console.log(".:: Setting POSTER ::.", player.state);
                    }
                    */

                    if (player.isConfig) {
                        scope.$watch(
                            function() {
                                return player.config;
                            },
                            function() {
                                if (player.plugins) {
                                    scope.url = player.plugins.poster.url;
                                }
                            }
                        );
                    }  

                    scope.$watch(
                        function() {
                            return player.state;
                        },
                        function(newState, oldState) {
                            scope.showHide(newState);
                        }
                    );

                    // set player native poster
                    // player.playerElement.poster = scope.url;

                    player.log(".::: avangu player poster plugin :::.");
                }
            }
        }
    }]
);