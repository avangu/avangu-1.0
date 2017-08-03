'use strict'

/**
* avangu angular module
* 
* @module avangu
* @main Avangu
*/
angular.module("avangu", [
    "avangu.helpers",
    "avangu.plugins",
]);

// plugin module
angular.module("avangu.plugins", []);


/**
* avangu helper module
* 
* @module avangu
* @main Avangu
*/
angular.module("avangu.helpers", [])
    /**
    * avangu player states constants
    * 
    * @class STATES
    * @static
    */
    .constant("$AVGU_STATES", {
            "PLAY": "playing",         // playing
            "PAUSE": "paused",       // paused
            "STOP": "stopped",         // stopped
            "EXIT": "exit"
        })

    /**
    * avangu player events
    * 
    * @class STATES
    * @static
    */
    .constant("$AVGU_EVENTS", {
        "LOAD": "load"
    })

    /**
    * AVANGU Services
    */

   /**
    * avangu player loading config service
    *
    * @class STATES
    * @static
    */
    .service("$AvguConfig", ["$http", "$q", "$sce", function ($http, $q, $sce) {

        this.load = function (url) {
            var deferred = $q.defer();

            $http({
                method: "GET",
                url: "components/avangu/assets/config.json"//url
            }).success(function(response) {

                console.log (".::: config loaded successfully :::.", response);
                
                var result = response;

                for (var i = 0, l = result.source.length; i < l; i++) {
                    result.source[i].src = $sce.trustAsResourceUrl(result.source[i].src);
                }

                deferred.resolve(result);

            }).error(function() {
                deferred.reject(".::: Error:: config loading :::."); 
                
                console.log (".::: config loading failed :::.");
            })

            return deferred.promise;
        }
    }])

  /**
    * avangu player native fullscreen service
    * 
    * @class STATES
    * @static
    */
    // 
    .service("$AvguFullscreen", [function () {

        var element, browser = null,
            browsers = {
                w: {
                    enabled: "fullscreenEnabled",
                    element: "fullscreenElement",
                    request: "requestFullscreen",
                    exit: "exitFullscreen",
                    onchange: "fullscreenchange",
                    onerror: "fullscreenerror"
                },
               webkit: {
                    enabled: "webkitFullscreenEnabled",
                    element: "webkitFullscreenElement",
                    request: "webkitRequestFullscreen",
                    exit: "webkitExitFullscreen",
                    onchange: "webkitfullscreenchange",
                    onerror: "webkitfullscreenerror"
                },
               oldWebkit: {
                    enabled: "webkitIsFullScreen",
                    element: "webkitCurrentFullScreenElement",
                    request: "webkitRequestFullScreen",
                    exit: "webkitCancelFullScreen",
                    onchange: "webkitfullscreenchange",
                    onerror: "webkitfullscreenerror"
                },
                moz: {
                    enabled: "mozFullScreen",
                    element: "mozFullScreenElement",
                    request: "mozRequestFullScreen",
                    exit: "mozCancelFullScreen",
                    onchange: "mozfullscreenchange",
                    onerror: "mozfullscreenerror"
                },
                ms: {
                    enabled: "msFullscreenEnabled",
                    element: "msFullscreenElement",
                    request: "msRequestFullscreen",
                    exit: "msExitFullscreen",
                    onchange: "MSFullscreenChange",
                    onerror: "MSFullscreenError"
                },
                ios: {
                    enabled: "webkitFullscreenEnabled",
                    element: "webkitFullscreenElement",
                    request: "webkitEnterFullscreen",
                    exit: "webkitExitFullscreen",
                    onchange: "webkitfullscreenchange",
                    onerror: "webkitfullscreenerror"
                }
            }

        function getBrowsers() {
           for (var key in browsers) {
               if (browsers[key].enabled in document) {
                   browser = browsers[key];
                   break;
               }
            }

            console.log(".::: FULLSCREEN:::: Check broswers :::.", browser);
        }

        // get browser [webkit, moz, ms, ios]
        getBrowsers();

        this.isAvailable = function() {
            return !!(browser);

            console.log(".::: FULLSCREEN:::: is available :::.", browser);
        }

        if (browser) {
            this.isFullscreen = function() {
                return !!(document[browser.element] != null || document.webkitIsFullScreen);

                console.log(".::: FULLSCREEN:::: is in fullscreen :::.", browser);
            }

            this.requestFullscreen = function(elem) {
                element = elem;
                element[browser.request]();

                console.log(".::: FULLSCREEN:::: REQUEST fullscreen :::.", browser);
            }

            this.exitFullscreen = function() {
                document[browser.exit]();

                console.log(".::: FULLSCREEN:::: EXIT fullscreen :::.", browser);
            }
        }
    }]
);
// 'use strict';

/*
* avangu player module
*/
angular.module("avangu")

/*
* avangu player controller
*/
.controller("AvanguController", ["$scope", "$window", "$AvguConfig", "$AvguFullscreen", "$AVGU_STATES", function ($scope, $window, $AvguConfig, $AvguFullscreen, $AVGU_STATES) {

    /**
     * public audios/video element
     *
     * @variable avanguElement
     * @type {object}
     * @default null
     */
    this.dev_mode = false;
    
    /**
     * public audios/video element
     *
     * @variable avanguElement
     * @type {object}
     * @default null
     */
    this.avanguElement = null;
    
    /**
     * public audios/video element
     *
     * @variable playerElement
     * @type {object}
     * @default null
     */
    this.playerElement = null;
     
    /**
     * play video
     *
     * @method play
     * @return {void}
     */
    this.play = function() {
        var player = this;
        
        player.playerElement.play();
        player.setState($AVGU_STATES.PLAY);
        player.isPaused = false;
        player.isPlaying = true
        console.log("PLAYING >", player.state);
    }

    /**
     * pause video
     *
     * @method pause
     * @return {void}
     */
    this.pause = function() {
        var player = this;
        
        player.playerElement.pause();
        player.setState($AVGU_STATES.PAUSE);
        player.isPaused = true;
        player.isPlaying = false;
        
        console.log("PAUSED ||", player.state);
    }

    /**
     * toggle video between play and pause
     *
     * @method playPause
     * @return {void}
     */
   this.playPause = function() {
       var player = this;
       
       if (!player.playerElement.paused) {
           player.pause(); 
       } else {
        player.play();
       }
    }

    /**
     * stop video
     *
     * @method stop
     * @return {void}
     */
    this.stop = function() {
        var player = this;
        
        try {
            player.playerElement.pause();
            player.playerElement.currentTime = 0;
            player.currentTime = 0;
            player.buffered = [];
            player.setState($AVGU_STATES.STOP);
            player.isPaused = true;
            player.isPlaying = false;
            console.log("PAUSE ||", player.state);
        } catch (e) {
            return e;
        }
    }

    /**
     * restart video
     *
     * @method restart
     * @return {void}
     */
    this.restart = function() {
        var player = this;
        
        player.setTime(0);
    }

    /**
     * skip video
     *
     * @method skip
     * @param {int} value
     * @return {void}
     */
    this.skip = function(value) {
        var player = this;
        
        player.setTime(value);
    }
    
    /**
     * mute
     *
     * @method mute
     * @return {void}
     */
    this.mute = function() {
        var player = this;
        
        player.playerElement.muted = true;
        player.mute = true;
    }

    /**
     * unmute
     *
     * @method unmute
     * @return {void}
     */
    this.unmute = function() {
        var player = this;
        
        player.playerElement.muted = false;
        player.mute = false;
    }
    
   /**
     * toggle mute
     *
     * @method togglemute
     * @return {void}
     */
   this.toogleMute = function() {
       var player = this;
       
       if (player.playerElement.muted) {
            player.mute(); 
       } else {
           player.unmute();
       }
    }

   /**
     * clear video source
     *
     * @method clearVideo
     * @return {void}
     */
    this.clearSource = function () {
        var player = this;
        
        player.playerElement.src = "";
    };
    
    /**
     * Set player state - play, pause or stop
     *
     * @method setState
     * @param {string} value
     * @return {void}
     */
    this.setState = function(value) {
        var player = this;

        if (value && value != player.state ) {
            player.state = value;
        }
        return this.state;
    }

    /**
     * set time (0 - 1)
     *
     * @method setVolume
     * @param {int} value
     * @return {void}
     */
    this.setTime = function(value) {
        var player = this;
        
        try {
            if (value == 0) {
                player.playerElement.currentTime = value;
            } else {
                player.playerElement.currentTime += value;
                player.currentTime += value;
            }
        } catch (e) {
            console.log(".::: Error: setting time :::.", e);
        }
        
        player.currentTime = player.playerElement.currentTime;
    }
    
    /**
     * set volume range(0 - 1) based on incoming value
     *
     * @method setVolume
     * @param {int} value
     * @return {void}
     */
    this.setVolume = function(value) {
        var player,
            volume = this.playerElement.volume;
        
        volume += value;
        // test for range 0 - 1 to avoid exceptions
        if (vol >= 0 && vol <= 1) {
            // if valid value, use it
            player.playerElement.volume = volume;
        } else {
             // otherwise substitute a 0 or 1
            player.playerElement.volume = (volume < 0) ? 0 : 1;           
        }
    }

    /**
     * set playback
     *
     * @method setPlayback
     * @param {int} value
     * @return {void}
     */
    this.setPlayback = function(value) {
        var player = this;
        
        player.playerElement.playbackRate = value;
        player.playback = value;
    }

    /**
     * Set autoplay
     *
     * @method setAutoplay
     * @param {bool} value
     * @return {void}
     */
    this.setAutoplay = function(bool) {
        var player = this;
        
        player.playerElement.autoplay = !!bool;
        player.autoplay = !!bool;
    }

    /**
     * Set Loop
     *
     * @method setAutoplay
     * @param {bool} value
     * @return {void}
     */
    this.setLoop = function(bool) {
        var player = this;
        
        player.playerElement.loop = !!bool;
        player.loop = !!bool;
    }

    /**
     * toggle fullscreen
     *
     * @method toggleFullscreen
     * @param {object} value
     * @return {void}
     */
    this.toggleFullscreen = function(value) {
        var player = this;
        
        if (player.isFullscreenAvailable) {
            
            if (player.isFullscreen) {
                $AvguFullscreen.exitFullscreen();
            } else {
                $AvguFullscreen.requestFullscreen(player.playerElement);
            }   
        }
    }
   
    /**
     * player on change source event
     *
     * @method onChangeSource
     * @param {object} source
     * @return {void}
     */
    this.onChangeSource = function(source) {
        $scope.onChangeSource({$source: source});
        
        console.log(".::: EVENT: Changing/setting Source :::.", source);
    }

    /**
     * on complete
     *
     * @method onComplete
     * @return {void}
     */
    this.onComplete = function() {
        var player = this;
        
        $scope.onComplete();
        
        player.setState($AVGU_STATES.STOP);
        player.isCompleted = true;
        
        $scope.$apply();
        
        console.log(".::: EVENT::: COMPLETE :::.", player.state);
    }

    /**
     * on error
     *
     * @method onError
     * @return {void}
     */
    this.onError = function(evt) {
        $scope.onError({$event: evt});
    }

    /**
     * on can play
     *
     * @method onCanPlay
     * @param {object} evt
     * @return {void}
     */
    this.onCanPlay = function(evt) {
        var player = this;
        
        this.buffering = false;
        $scope.$apply($scope.onCanPlay({$event: evt}));
        
        console.log(".::: EVENT::: Can-play :::. ", evt);
    }

    /**
     * on play
     *
     * @method onPlay
     * @return {void}
     */
    this.onPlay = function() {
        var player = this;
        
        player.setState($AVGU_STATES.PLAY);
        $scope.$apply();
        
        console.log(".::: EVENT::: PLAY :::.", player.state);
    }

    /**
     * on pause
     *
     * @method onPause
     * @return {void}
     */
    this.onPause = function() {
        var player = this;
        
        if(player.playerElement.currentTime == 0) {
            player.setState($AVGU_STATES.STOP);
        } else {
            player.setState($AVGU_STATES.PAUSE);   
        }
        
        $scope.$apply();
        console.log(".::: EVENT::: PAUSE :::.", player.state);
    }

    /**
     * on volume change
     *
     * @method onVolumeChange
     * @return {void}
     */
    this.onVolumeChange = function() {
        var player = this;
        
        player.volume = player.playerElement.volume;
        $scope.$apply();
        
        console.log(".::: EVENT::: VOLUME CHANGE :::.");
    }

    /**
     * on playback change
     *
     * @method onPlackbackChange
     * @return {void}
     */
    this.onPlaybackChange = function() {
        var player = this;
        
        player.playback = player.playerElement.playback;
        $scope.$apply();
        
        console.log(".::: EVENT::: PLAYBACK CHANGE :::.");
    }

    /**
     * on seeking
     *
     * @method onSeeking
     * @return {void}
     */
    this.onSeeking = function() {
        
    }

    /**
     * on ready
     *
     * @method onReady
     * @return {void}
     */
    this.ready = function() {
        var player = this;
        
        player.isReady = true;
        player.autoplay = $scope.autoplay || false;
        player.loop = $scope.loop || false;
        player.mute = $scope.mute || false;
        // player.nativeControls = $scope.nativeControls || false;
        // player.fullscreen = $scope.fullscreen || true;

        // this.playsInline = $scope.vgPlaysInline;
        // this.cuePoints = $scope.vgCuePoints;
        // this.clearMediaOnNavigate = $scope.vgClearMediaOnNavigate || true;
        
        // set player state to stop when ready
        player.setState($AVGU_STATES.STOP);

        // loading config
        if (player.isConfig) {
            
            console.log(".::: avangu player loding config :::.", player.configUrl);
            
            $AvguConfig.load(player.configUrl).then (
                player.onConfigLoad.bind(this)
            );
        } else {
            $scope.onPlayerReady({$API: this});
        }
        
        console.log(".::: avangu player is ready :::.", player.state);
    }
    
    /**
     * create event listeners
     *
     * @method createListeners
     * @return {void}
     */
    this.createListeners = function() {
        var player = this;
        
        player.playerElement.addEventListener("canplay", player.onCanPlay.bind(this), false);
    
        player.playerElement.addEventListener("pause", player.onPause.bind(this), false);
        player.playerElement.addEventListener("play", player.onPlay.bind(this), false);        
        player.playerElement.addEventListener("ended", player.onComplete.bind(this), false);

        player.playerElement.addEventListener("volumechange", player.onVolumeChange.bind(this), false);
        player.playerElement.addEventListener("playbackchange", player.onPlaybackChange.bind(this), false);

        player.playerElement.addEventListener("seeking", player.onSeeking.bind(this), false);
        // player.playerElement.addEventListener("seeked", this.onSeeked.bind(this), false);
        
        player.playerElement.addEventListener("error", player.onError.bind(this), false);
       
        console.log(".::: creating avangu event Listeners :::.");
    }

    /**
     * initialize default
     *
     * @method init
     * @param {object} config
     * @return {void}
     */
    this.init = function() {
        var player = this;
        
        player.isReady = false;
        player.isComplete = false;
        
        player.isPaused = true;
        player.isPlaying = false;
        
        player.isFullscreen = !!$AvguFullscreen.isFullscreen();
        player.isFullscreenAvailable = !!$AvguFullscreen.isAvailable();
        
        player.isConfig = ($scope.configUrl != undefined);
        
        if (player.isConfig)
            player.configUrl = $scope.configUrl;
        
        player.buffered = [];
        player.bufferedEnd = 0;
        
        player.currentTime = 0;
        player.totalTime = 0;
        
        player.volume = 0;

        player.state = "";
        
        player.playback = 1;
    
        console.log(".::: initializing avangu player :::.");
    }

    /**
     * load config
     *
     * @method onConfigLoad
     * @param {object} config
     * @return {void}
     */
    this.onConfigLoad = function(config) {
        var player = this;
        
        player.config = config;
        
        for (var key in config) {
            if (!$scope.hasOwnProperty(key)) {
                player[key] = config[key];
            }
        }
        /*
        console.log(config);
        console.log($scope);
        console.log(this);
        */
        
        console.log(".::: Config Loaded :::.", config);
    }
    
       /**
     * log 
     *
     * @method log
     * @param {object} config
     * @return {void}
     */
    this.log = function( strObj, msgObj ) {
        var player = this;
        
        if (player.dev_mode) {
            console.log(strObj, msgObj);
        }
    }
    
    // initialize avangu player
    this.init();
}]);

// 'use strict';

angular.module("avangu")

/* avangu player Directive */
.directive("avangu", ["$timeout", "$AVGU_STATES", function($timeout, $AVGU_STATES) {
    
    return {
        restrict: "EA",
        controller: "AvanguController",
        controllerAs: "$API",
        
        scope: {
            configUrl: "@",
            autoplay: "=?",
            source: "=?",
            loop: "=?",
            preload: "=?",
            mute: "=?",
            nativeControls: "=?",
      
            updateTime: "&",
            updateState: "&",
            updateVolume: "&",
            updatePlayback: "&",

            dev_mode:"&",
            
            // callbacks
            onCanPlay: "&",
            onPlayerReady: "&",
            
            onPlay: "&",
            onPause: "&",
            onStop: "&",
            onComplete: "&",
            
            onPlaybackUpdate: "&",
            onVolumeChange: "&",
            
            onFullScreen: "&",
            onChangeSource: "&",
            
            onSeeking: "&",
            onSeeked: "&",
            onError: "&"
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
        link: {
            pre: function(scope, elem, attrs, $API) {
                var player = $API;
                
                // cache <viangu> elememnt
                player.avanguElement = elem;

                // set media source from scope attribute
                if (scope.source)
                    player.source = scope.source;
                
                console.log(".::: avangu player directive :::.", scope);
            }
        }
    }
}]);
// 'use strict';

angular.module("avangu")
    // cache video template 
    .run(["$templateCache",
        // save media [audio/video] template to cache
        function ($templateCache) {
            // video template
            $templateCache.put("avgu-templates/avgu-player-video",
                "<video></video>"
            );
            // audio template
            $templateCache.put("avgu-templates/avgu-player-audio",
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
                return  "avgu-templates/avgu-player-" + attrs.type;
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
                        sources = newSource;

                        if (player.state !== $AVGU_STATES.PLAY) {
                            player.state = $AVGU_STATES.STOP;
                        }

                        player.source = sources;
                        scope.setSource(newSource);
                    }

                    console.log(".::: EVENT ON Changing SOurce Source Set :::.", newSource);
                };              

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
                    };

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
                
                // addClass name to Attribute
                // elem.addClass(player.type);

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
                );

                if (player.isConfig) {
                    scope.$watch(
                        function() {
                            return player.config;
                        },
                        function() {
                            if (player.config) {
                                scope.source = player.source;
                                scope.setAttrBool("autoplay", !!player.autoplay);
                                scope.setAttrBool("loop", !!player.loop);
                                scope.setAttrBool("muted", !!player.mute);
                                scope.setAttrBool("dev_mode", !!player.dev_mode);
                                // scope.setAttrBool("controls", player.nativeControls);
                            }
                        }
                    )
                } else {
                    scope.$watch("autoplay", scope.setAttrBool("autoplay", !!player.autoplay));
                    scope.$watch("loop", scope.setAttrBool("loop", !!player.loop));
                    scope.$watch("mute", scope.setAttrBool("muted", !!player.mute));
                    scope.$watch("dev_mode", scope.setAttrBool("dev_mode", !!player.loop));
                    // scope.$watch("nativeControls", scope.setAttrBool("controls", player.nativeControls));
                }

                player.log(".::: avangu player video plugin :::.");
            }
        }
    }]
);