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

    module.directive('ahRegexp', [function() {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function($scope, elem, attr, ctrl) {

          function validator(value) {
            try {
              //noinspection JSLint,JSPotentiallyInvalidConstructorUsage
              RegExp(value);
              ctrl.$setValidity('ahRegexp', true);
              return value;
            } catch (err) {
              ctrl.$setValidity('ahRegexp', false);
              return undefined;
            }
          }

          ctrl.$parsers.push(validator);
          ctrl.$formatters.push(validator);
        }
      };
    }]);


    return {};
  });
}());
