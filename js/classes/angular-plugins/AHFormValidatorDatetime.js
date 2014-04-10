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


    function isEmpty(value) {
      return Utility.isUndefined(value) || value === '' || value === null;
    }

    module.directive('ahDatetime', [
      '$parse', '$filter',
      function($parse) {
        return {
          restrict: 'A',
          require: 'ngModel',
          link: function($scope, elem, attr, ctrl) {

            function validator(viewValue) {

              if (isEmpty(viewValue)) {
                ctrl.$setValidity('ahDatetime', true);
                return viewValue;
              }

              if (Utility.isSimpleDateStringValid(viewValue)) {
                ctrl.$setValidity('ahDatetime', true);

                return viewValue;
              }

              ctrl.$setValidity('ahDatetime', false);

              return viewValue;
            }

            ctrl.$parsers.push(validator);
            ctrl.$formatters.push(validator);
          }
        };
      }]);

    return {};
  });
}());
