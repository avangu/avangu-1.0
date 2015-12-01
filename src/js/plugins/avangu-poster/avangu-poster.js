'use strict';

angular.module("avangu")
    // cache video template 
    .run(["$templateCache",
        // save poster template to cache
        function ($templateCache) {
            $templateCache.put("avgu-templates/avgu-poster",
                '<img ng-src="{{url}}" ng-class="API.state">'
            );
        }
     ])

    /* avangu poster plugin directive */
    .directive("avanguPoster", ["$timeout", "$AVGU_STATES", function($timeout, $AVGU_STATES) {
        return {
            restrict: "E", 
            require: "^avangu",
            
            templateUrl: function(elem, attrs) {
                // return poster template from cache
                return  "avgu-templates/avgu-poster"
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
                var player = $API,
                    defaultPoster = "app/components/avangu/poster.png";
                
                if (player.type === "video") {
                    scope.API = player;

                    scope.setPoster = function (newUrl, oldUrl) {   
                       if (( newUrl != oldUrl) && newUrl ) {
                            player.playerElement.poster = newUrl;
                       }
                    }

                    if (!scope.url) {
                        scope.url = defaultPoster;

                        if (player.isConfig) {
                            scope.$watch(
                                function() {
                                    return player.plugins;
                                },
                                function() {
                                    if (player.plugins) {
                                        scope.url = player.plugins.poster.url;
                                    }
                                }
                            )
                        }  
                    }

                    scope.$watch(
                        function() {
                            return scope.url;
                        },
                        scope.setPoster
                    )

                    // set player native poster
                    // player.playerElement.poster = scope.url;

                    console.log(".::: avangu player poster plugin :::.");
                }
            }
        }
    }]
);