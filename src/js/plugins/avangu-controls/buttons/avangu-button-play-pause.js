// 'use strict';


angular.module("avangu.plugins.controls")
    // cache video template 
    .run(["$templateCache",
        // save poster template to cache
        function ($templateCache) {
            $templateCache.put("avgu-templates/avgu-controls-play-pause-btn",
                '<button class="icon" ng-click="togglePlay()" aria-label="Play/Pause"><span class="icon" ng-class="avguClass"><span></button>'
            );
        }
     ])

    /* avangu controls plugin directive */
    .directive("avanguButtonPlayPause", ["$timeout", "$AVGU_STATES", function($timeout, $AVGU_STATES) {
        return {
            restrict: "E", 
            require: "^avangu",
            replace: true,
            
            templateUrl: function(elem, attrs) {
                // return poster template from cache
                return "avgu-templates/avgu-controls-play-pause-btn"
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
                    switch ( val ) {
                        case $AVGU_STATES.PLAY:
                            scope.avguClass = "pause";
                            break;
                        case $AVGU_STATES.PAUSE:
                            scope.avguClass = "play";
                            break;
                        case $AVGU_STATES.STOP:
                            scope.avguClass = "play";
                            break;
                    }
                };

                scope.togglePlay = function() {
                    player.playPause();
                    scope.setState(player.state);
                };
                
                // set default buttton state
                scope.setState(player.state);
                
                player.log(".::: avangu player controls plugin Play Pause Button  :::.", player.state);
            }
        }
    }]
);