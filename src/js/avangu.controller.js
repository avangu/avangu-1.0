'use strict';

/*
* avangu player module
*/
angular.module("avangu")

/*
* avangu player controller
*/
.controller("AvanguCtrl", ["$scope", "$window", "$AvguConfig", "$AvguFullscreen", "$AVGU_STATES", function ($scope, $window, $AvguConfig, $AvguFullscreen, $AVGU_STATES) {

   /**
     * public audios/video element
     *
     * @variable vianguElement
     * @type {object}
     * @default null
     */
    this.vianguElement = null;
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
    }

    /**
     * toggle video between play and pause
     *
     * @method playPause
     * @return {void}
     */
   this.playPause = function() {
       var player = this;
       
       if (player.playerElement.paused) {
           player.play();
       } else {
           player.pause(); 
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
     * Set autoplay
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
        player.nativeControls = $scope.nativeControls || false;
        // player.fullscreen = $scope.fullscreen || true;

        // this.playsInline = $scope.vgPlaysInline;
        // this.cuePoints = $scope.vgCuePoints;
        // this.clearMediaOnNavigate = $scope.vgClearMediaOnNavigate || true;
        
        // set player state to stop when ready
        player.setState($AVGU_STATES.STOP);

        // loading config
        if (player.isConfig) {
            $AvguConfig.load($scope.configUrl).then (
                player.onConfigLoad.bind(this)
            );
        } else {
            $scope.onPlayerReady({$API: this});
        }
        
        console.log(".::: avangu player is ready :::.");
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
        
        console.log(config);
        console.log($scope);
        console.log(this);
        
        console.log(".::: Config Loaded :::.");
    }
    
    // initialize avangu player
    this.init();
}]);
