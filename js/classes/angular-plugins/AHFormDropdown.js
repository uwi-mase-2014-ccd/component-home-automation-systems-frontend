/*global require */


/**
 *
 * Created on 12/28/13.
 * @author ahamidev@gmail.com (Aston Hamilton)
 */
(function() {
  'use strict';

  require([
    'classes/Utility',
    'modules/AH-Plugins'
  ], function(Utility, module) {

    module.directive('ahDropdown', [
      function() {
        return {
          restrict: 'A',
          require: 'ngModel',
          link: function($scope, elem, attr, ctrl) {

            $scope.$watch(attr.ahDropdown, function() {
              if (elem.hasClass('ui-typeahead-open')) {
                ctrl.$setViewValue(ctrl.$viewValue);
              }
            });
            elem.bind('keydown', function(evt) {
              if (!elem.hasClass('ui-typeahead-open') && evt.which === 40) {
                ctrl.$setViewValue(ctrl.$viewValue);
                return;
              }
            });
          }
        };
      }]);

    return {};
  });
}());
