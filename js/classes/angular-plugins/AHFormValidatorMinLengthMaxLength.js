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

    module.directive('ahMinlength', ['$parse', function($parse) {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function($scope, elem, attr, ctrl) {
          var minAccessor;

          minAccessor = $parse(attr.ahMinlength);

          $scope.$watch(attr.ahMinlength, function(newValue) {
            ctrl.$setViewValue(ctrl.$viewValue);
          });

          function minValidator(value) {
            var minConstraint = parseFloat(minAccessor($scope));

            if (isEmpty(value)) {
              ctrl.$setValidity('ahMinlength', true);
              return value;
            }

            if (minConstraint && String(value).length < minConstraint) {
              ctrl.$setValidity('ahMinlength', false);
              return value;
            }

            ctrl.$setValidity('ahMinlength', true);
            return value;
          }

          ctrl.$parsers.push(minValidator);
          ctrl.$formatters.push(minValidator);
        }
      };
    }]);

    module.directive('ahMaxlength', ['$parse', function($parse) {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function($scope, elem, attr, ctrl) {
          var maxAccessor;

          maxAccessor = $parse(attr.ahMaxlength);

          $scope.$watch(attr.ahMaxlength, function(newValue) {
            ctrl.$setViewValue(ctrl.$viewValue);
          });

          function maxValidator(value) {
            var max = parseFloat(maxAccessor($scope));

            if (isEmpty(value)) {
              ctrl.$setValidity('ahMaxlength', true);
              return value;
            }

            if (max && String(value || '').length > max) {
              ctrl.$setValidity('ahMaxlength', false);
              return value;
            }

            ctrl.$setValidity('ahMaxlength', true);
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
