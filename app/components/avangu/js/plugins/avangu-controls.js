'use strict';


angular.module("avangu.plugins.controls", []);

angular.module("avangu.plugins", [
    "avangu.plugins.controls"
])
    // cache video template 
    .run(["$templateCache",
        // save poster template to cache
        function ($templateCache) {
            $templateCache.put("avgu-templates/avgu-plugins-controls",
                '<div class="controls-hud" ng-class="avguClass" ng-transclude></div>'
            );
        }
     ])

    /* avangu controls plugin directive */
    .directive("avanguControls", ["$timeout", "$AVGU_STATES", function($timeout, $AVGU_STATES) {
        return {
            restrict: "E", 
            require: "^avangu",
            transclude: true,
            
            templateUrl: function(elem, attrs) {
                // return poster template from cache
                return "avgu-templates/avgu-plugins-controls"
            },
            
            scope: {
                autoHide: "=?",
                autoHideTimer: "=?"
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
                    userActivity,
                    inactiveTimer;
                
                scope.showControls = function() {
                    if (scope.autoHide && userActivity) {
                        userActivity = false;
                        $timeout.cancel(inactiveTimer);
                        inactiveTimer = $timeout(scope.hide, scope.autoHideTimer);
                        scope.show();
                    }
                
                    console.log("CONTROLS", scope.avguClass)
                }
                
                scope.setNavtiveControl = function(bool) {
                    player.playerElement["controls"] = !!bool;
                }

                // hide controls
                scope.hide = function() {
                    scope.avguClass = "hide";
                }
                
                // show controls
                scope.show = function(){
                    scope.avguClass = "show";
                }

                if (player.isConfig) {
                    scope.$watch(
                        function() {
                            return player.config;
                        },
                        function() {
                            if (player.config) {
                                scope.autoHide = !!player.plugins.controls.autoHide;
                                scope.autoHideDelay = player.plugins.controls.autoHideDelay || 2000;
                                scope.setNavtiveControl( !!player.plugins.controls.nativeControls || false);
                                
                                scope.hide();
                            }
                        }
                    )
                } else {
                    scope.$watch("autoHide", !!scope.autoHide);
                    scope.$watch("autoHideTimer", !!scope.autoHideTimer);
                    scope.$watch("nativeControls", scope.setNavtiveControl(!!player.nativeControls || false));
                }

                // set 
                player.playerElement.addEventListener("mousemove", function() {
                    userActivity = true;
                    if (scope.autoHide && !scope.setNavtiveControl) {
                        scope.showControls();
                    } else {
                        scope.show();
                    }
                    scope.$apply();
                }, false);

                console.log(".::: avangu player controls plugin :::.");
            }
        }
    }]
);
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