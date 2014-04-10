/*global define */


/**
 *
 * @author ahamidev@gmail.com (Aston Hamilton)
 */

(function() {
  'use strict';

  define([
    'modules/AH-Plugins'
  ], function(module) {
    var TOAST_ICON_MAP;


    TOAST_ICON_MAP = {
      info: 'fa-info',
      warning: 'fa-warning',
      error: 'fa-minus-circle',
      success: 'fa-check'
    };
    module.factory('ahToast', ['$rootScope', function($rootScope) {
      var toastService;

      function buildNewToastSignalGenerator(type) {
        var TOAST_TIMES;

        TOAST_TIMES = {
          short: 2000,
          medium: 2500,
          long: 3000
        };
        return function sendNewToastSignal(title, timeout) {
          var resolvedTimeout;

          if (TOAST_TIMES.hasOwnProperty(timeout)) {
            resolvedTimeout = TOAST_TIMES[timeout];
          } else if (typeof timeout !== 'number') {
            resolvedTimeout = TOAST_TIMES.short;
          } else {
            resolvedTimeout = timeout;
          }


          $rootScope.$broadcast('ahToast-newToast', {
            title: title,
            // Chose not to use this feature ATM although its fully implemented
            body: undefined,
            timeout: resolvedTimeout,
            type: type || 'info'
          });
        };
      }

      toastService = {
        warn: buildNewToastSignalGenerator('warning'),
        info: buildNewToastSignalGenerator('info'),
        error: buildNewToastSignalGenerator('error'),
        success: buildNewToastSignalGenerator('success')
      };

      return toastService;
    }]);

    module.directive('ahToastContainer', ['$timeout', function($timeout) {
      return {
        replace: true,
        scope: true,
        restrict: 'A',
        link: function(scope) {

          var id = 0;

          function addToast(toast) {
            toast.id = id;
            id += 1;

            toast.typeClass = 'ah-toast-' + toast.type;
            toast.iconClass = TOAST_ICON_MAP[toast.type] || TOAST_ICON_MAP.info;

            if (toast.timeout > 0) {
              toast.timer = $timeout(function() {
                scope.removeToast(toast.id);
              }, toast.timeout);
            }

            scope.toasts.unshift(toast);
          }


          scope.toasts = [];

          scope.$on('ahToast-newToast', function(e, toast) {
            addToast(toast);
          });

          scope.removeToast = function(id) {
            var index;

            for (index = 0; index < scope.toasts.length; index += 1) {
              if (scope.toasts[index].id === id) {
                break;
              }
            }
            scope.toasts.splice(index, 1);
          };
        },
        template: ' <div class="ah-toast-container">' +
                  '   <div ng-repeat="toast in toasts" class="ah-toast animated" ng-class="toast.typeClass" ng-click="removeToast(toast.id)">' +
                  '     <div class="ah-toast-title"><i class="fa" ng-class="toast.iconClass"></i>' +
                  '       <span ng-bind="toast.title"></span>' +
                  '     </div>' +
                  '     <div class="ah-toast-message" ng-show="toast.body">' +
                  '       <span ng-bind="toast.body"></span>' +
                  '     </div>' +
                  '   </div>' +
                  ' </div>'
      };
    }]);
  });

}());
