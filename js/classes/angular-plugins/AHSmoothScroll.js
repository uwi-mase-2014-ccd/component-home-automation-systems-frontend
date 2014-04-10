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


    module.directive('ahSmoothScroll', [
      '$animate', '$location', '$anchorScroll',
      function($animate, $location, $anchorScroll) {
        function link(scope, element, attrs) {
          element.on('click', function(e) {
            e.preventDefault();
            $location.hash(attrs.ahSmoothScroll);

            //$anchorScroll();

            return false;
          });
        }

        return {
          link: link
        };
      }]);
    return {};
  });
}());
