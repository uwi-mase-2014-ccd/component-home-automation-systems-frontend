/*global require, clearTimeout, setTimeout */


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

    module.directive('ahInitFocus', ['$timeout', function($timeout) {

      return function(scope, elm, attr) {
        $timeout(function() {
          elm[0].focus();

          elm.attr('autofocus', true);
        });
      };
    }]);

    return {};
  });
}());
