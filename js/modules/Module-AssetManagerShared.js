/*global define */


/**
 *
 * Created on 12/25/13.
 * @author ahamidev@gmail.com (Aston Hamilton)
 */
(function() {
  'use strict';

  define([
    'vendor/angular',
    'vendor/modernizer',

    'classes/Utility'
  ], function(angular, Modernizer, Utility) {
    var module;

    module = angular.module('Module/AssetManager/Shared', ['ui.router']);

    module.run(['$state', '$stateParams', '$rootScope',
      function($state, $stateParams, $rootScope) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

        $rootScope.SCREEN_SIZE_SMALL = 1;
        $rootScope.SCREEN_SIZE_XL = 4;

        $rootScope.screenSize = function() {
          if (Modernizer.mq('(max-width: 40em)')) {
            return $rootScope.SCREEN_SIZE_SMALL;
          }

          return $rootScope.SCREEN_SIZE_XL;
        };

        $rootScope.addAsset = function() {
          if ($stateParams.categoryId) {
            $state
              .go('assets.records.new', {categoryId: $stateParams.categoryId});
          } else {
            $state
              .go('assets.new');
          }
        };

        $rootScope.Utility = Utility;
      }]);

    return module;
  });
}());
