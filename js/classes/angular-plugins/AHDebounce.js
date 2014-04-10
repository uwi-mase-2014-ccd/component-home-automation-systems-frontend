/*global require */


/**
 *
 * Created on 12/28/13.
 * @author ahamidev@gmail.com (Aston Hamilton)
 */
(function() {
  'use strict';

  require([
    'modules/AH-Plugins'
  ], function(module) {

    module.factory('ahDebounce', ['$timeout', function($timeout) {

      function debounced(cb, throttle) {
        var pendingDelay = false, inLimboWaiting = false;

        function debouncedWrapper() {
          if (inLimboWaiting) {
            pendingDelay = true;
            return;
          }

          inLimboWaiting = true;
          $timeout(function() {
            inLimboWaiting = false;
            if (pendingDelay) {
              pendingDelay = false;
              debouncedWrapper();
              return;
            }
            cb();
          }, throttle);
        }

        return debouncedWrapper;
      }

      return debounced;
    }]);

    return {};
  });
}());
