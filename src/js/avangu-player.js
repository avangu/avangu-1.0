'use strict';

angular.module("avangu")
    // cache video template 
    .run(["$templateCache",
        // save media [audio/video] template to cache
        function ($templateCache) {
            $templateCache.put("avgu-templates/avgu-video",
                "<video></video>"
            );
            $templateCache.put("avgu-templates/avgu-audio",
                "<audio></audio>"
            );
        }
     ])

    /* avangu player directive */
    .directive("avanguPlayer", ["$timeout", "$AVGU_STATES", function($timeout, $AVGU_STATES) {
        return {
            restrict: "E", 
            require: "^avangu",
            
            templateUrl: function(elem, attrs) {
                
               // set media type from attributes - [video] as defaut type
                if (!attrs.type || attrs.type.toLowerCase() !== "audio"){
                    attrs.type = "video";
                } else {
                    attrs.type = "audio";  
                }
                
                // return media [audio/video] template from cache
                return  "avgu-templates/avgu-" + attrs.type;
            },
            
            scope: {
                type: "=?"
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
                    

                // when source is changed ($watchers)
                scope.onChangeSource = function (newSource, oldSource) {

                    if ((newSource != oldSource) && newSource ) {

                        if (player.state != $AVGU_STATES.PLAY) {
                            player.state = $AVGU_STATES.STOP;
                        }

                        player.source = newSource;
                        scope.setSource(newSource);
                    }

                    console.log(".::: EVENT ON Changing SOurce Source Set :::.", newSource);
                }                

                // set media source
                scope.setSource = function (source) {
                    var canplay = "";

                    if (source) {
                        if (player.playerElement.canPlayType) {
                            for (var i = 0, len = source.length; i < len; i++) {
                                canplay = player.playerElement.canPlayType(source[i].type);

                                if (canplay == "maybe" || canplay == "probably") {
                                    
                                    // set Video element source and type attribute 
                                    scope.setAttrText("src", source[i].src);
                                    scope.setAttrText("type", source[i].src);

                                    // trigger onChangeSource API callback in the controller
                                    player.onChangeSource(source[i]);
                                    break;
                                }
                            }
                        }
                    }

                    /*
                        $timeout(function() {
                            if (player.autoplay) {
                                player.play();
                            }
                        })
                    */

                    if (canplay == "") {
                        player.onError();
                    }

                    console.log(".::: Video Source Set :::.", source);
                }

                // set video element boolean attributes
                scope.setAttrBool = function(attr, bool) {
                   player.playerElement[attr] = !!bool;
                }

                // set video element text attributes
                scope.setAttrText = function(attr, text) {
                   player.playerElement[attr] = text;
                }

                // set player type [audio/video]
                player.type = attrs.type;
                
                // cache the [audio/video] element
                player.playerElement =  elem.find(attrs.type)[0];

                // create event listeners for callback 
                player.createListeners();
                
                // initialize avangu player when player is ready
                player.ready();

                // watchers
                // scope.$watch("source", scope.onChangeSource);

                scope.$watch(
                    function() {
                        return player.source;
                    },
                    scope.setSource
                )

                if (player.isConfig) {
                    scope.$watch(
                        function() {
                            return player.config;
                        },
                        function() {
                            if (player.config) {
                                scope.source = player.source;
                                scope.setAttrBool("autoplay", player.autoplay);
                                scope.setAttrBool("loop", player.loop);
                                scope.setAttrBool("muted", player.mute);
                                scope.setAttrBool("controls", player.nativeControls);
                            }
                        }
                    )
                } else {
                    scope.$watch("autoplay", scope.setAttrBool("autoplay", player.autoplay));
                    scope.$watch("loop", scope.setAttrBool("loop", player.loop));
                    scope.$watch("mute", scope.setAttrBool("muted", player.mute));
                    scope.$watch("nativeControls", scope.setAttrBool("controls", player.nativeControls));
                }

                console.log(".::: avangu player video plugin :::.");
            }
        }
    }]
);