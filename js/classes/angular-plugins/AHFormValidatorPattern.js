/*global require, clearTimeout, setTimeout */


/**
 *
 * Created on 12/28/13.
 * @author ahamidev@gmail.com (Aston Hamilton)
 */
(function() {
  'use strict';

  require([
    'modules/AH-Plugins',

    'classes/Utility'
  ], function(module, Utility) {

    function isEmpty(value) {
      return Utility.isUndefined(value) || value === '' || value === null;
    }

    module.directive('ahPattern', ['$parse', function($parse) {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function($scope, elem, attr, ctrl) {
          var regexpAccessor;

          regexpAccessor = $parse(attr.ahPattern);

          $scope.$watch(attr.ahPattern, function() {
            ctrl.$setViewValue(ctrl.$viewValue);
          });

          function validator(value) {
            var regEXP = regexpAccessor($scope);


            if (isEmpty(value)) {
              ctrl.$setValidity('ahPattern', true);
              return value;
            }

            if (regEXP && regEXP.test(value)) {
              ctrl.$setValidity('ahPattern', true);
              return value;
            }

            ctrl.$setValidity('ahPattern', false);
            return value;
          }

          ctrl.$parsers.push(validator);
          ctrl.$formatters.push(validator);
        }
      };
    }]);


    return {};
  });
}());
