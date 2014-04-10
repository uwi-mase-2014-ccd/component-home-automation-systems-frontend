/*global define, require, document */


/**
 *
 * Created on 12/25/13.
 * @author ahamidev@gmail.com (Aston Hamilton)
 */
(function() {
  'use strict';

  require.config({
    shim: {
      'vendor/modernizer': {
        exports: 'Modernizr'
      },
      'vendor/debug': {
        exports: 'debug'
      },
      'vendor/chancejs': {
        exports: 'Chance'
      },
      'vendor/angular': {
        exports: 'angular'
      },
      'vendor/angular/cookies': {
        deps: ['vendor/angular']
      },
      'vendor/angular/animations': {
        deps: ['vendor/angular']
      },
      'vendor/angular/router': {
        deps: ['vendor/angular']
      },
      'vendor/ui-utils': {
        deps: ['vendor/angular']
      },
      'vendor/ui-bootstrap': {
        deps: ['vendor/angular']
      },
      'vendor/ui-bootstrap/tpls': {
        deps: ['vendor/angular', 'vendor/ui-bootstrap']
      },
      'vendor/underscore': {
        exports: '_'
      }
    },

    paths: {
      'vendor/modernizer': 'vendor/trunk/custom.modernizr',
      'vendor/debug': 'vendor/trunk/debug',
      'vendor/chancejs': 'vendor/trunk/chance.min',
      'vendor/angular': 'vendor/angular/angular',
      'vendor/angular/animations': 'vendor/angular/angular-animate',
      'vendor/angular/cookies': 'vendor/angular/angular-cookies',
      'vendor/angular/router': 'vendor/angular-ui-router/angular-ui-router',
      'vendor/ui-utils': 'vendor/angular-ui-utils/ui-utils',
      'vendor/ui-bootstrap': 'vendor/ui-bootstrap/ui-bootstrap-custom-0.10.0',
      'vendor/ui-bootstrap/tpls':
          'vendor/ui-bootstrap/ui-bootstrap-custom-tpls-0.10.0',
      'vendor/underscore': 'vendor/underscorejs/underscore-min',
      'vendor/async': 'vendor/trunk/async'
    }
  });

  require([
    'vendor/modernizer',
    'vendor/angular',
    'vendor/angular/animations',
    'vendor/angular/cookies',
    'vendor/ui-bootstrap/tpls',
    'modules/Module-AssetManagerShared',
    'modules/Page-ManageAssetsMain'
  ], function(ignored, angular) {


    angular.bootstrap(document, [
      'Page/ManageAssets/Main',
      'Module/AssetManager/Shared', 'ngAnimate', 'ngCookies', 'ui.bootstrap'
    ]);
  });
}());
