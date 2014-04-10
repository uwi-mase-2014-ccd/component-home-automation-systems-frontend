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
      return Utility.isUndefined(value) ||
             Utility.str.trim(value).length === 0 ||
             value === null;
    }

    module.directive('ahFloat', [function() {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function($scope, elem, attr, ctrl) {
          var numericRegEXP;

          numericRegEXP = new RegExp('^[+-]?[0-9]+(.[0-9]+)?$');

          function validator(value) {
            if (isEmpty(value)) {
              ctrl.$setValidity('ahFloat', true);
              return undefined;
            }

            if (numericRegEXP.test(value)) {
              ctrl.$setValidity('ahFloat', true);
              return parseFloat(value);
            }

            ctrl.$setValidity('ahFloat', false);
            return undefined;
          }

          ctrl.$parsers.push(validator);
          ctrl.$formatters.push(validator);
        }
      };
    }]);


    module.directive('ahInteger', [function() {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function($scope, elem, attr, ctrl) {
          var numericRegEXP;

          numericRegEXP = new RegExp('^[-+]?[0-9]+$');

          function validator(value) {
            if (isEmpty(value)) {
              ctrl.$setValidity('ahInteger', true);
              return undefined;
            }

            if (numericRegEXP.test(value)) {
              ctrl.$setValidity('ahInteger', true);
              return parseInt(value, 10);
            }

            ctrl.$setValidity('ahInteger', false);
            return undefined;
          }

          ctrl.$parsers.push(validator);
          ctrl.$formatters.push(validator);
        }
      };
    }]);


    return {};
  });
}());
