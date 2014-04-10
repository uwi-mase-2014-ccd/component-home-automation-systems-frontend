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

    module.directive('ahMin', ['$parse', function($parse) {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function($scope, elem, attr, ctrl) {
          var minAccessor;

          minAccessor = $parse(attr.ahMin);

          $scope.$watch(attr.ahMin, function(newValue) {
            ctrl.$setViewValue(ctrl.$viewValue);
            elem.attr('min', newValue);
          });

          function minValidator(value) {
            var minConstraint = parseFloat(minAccessor($scope));

            if (!isEmpty(value) &&
                value < minConstraint) {
              ctrl.$setValidity('ahMin', false);
              return undefined;
            }

            ctrl.$setValidity('ahMin', true);
            return value;
          }

          ctrl.$parsers.push(minValidator);
          ctrl.$formatters.push(minValidator);
        }
      };
    }]);

    module.directive('ahMax', ['$parse', function($parse) {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function($scope, elem, attr, ctrl) {
          var maxAccessor;

          maxAccessor = $parse(attr.ahMax);

          $scope.$watch(attr.ahMax, function(newValue) {
            ctrl.$setViewValue(ctrl.$viewValue);
            elem.attr('max', newValue);
          });

          function maxValidator(value) {
            var max = parseFloat(maxAccessor($scope));

            if (!isEmpty(value) && value > max) {
              ctrl.$setValidity('ahMax', false);
              return undefined;
            }

            ctrl.$setValidity('ahMax', true);
            return value;
          }

          ctrl.$parsers.push(maxValidator);
          ctrl.$formatters.push(maxValidator);
        }
      };
    }]);

    return {};
  });
}());
