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