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