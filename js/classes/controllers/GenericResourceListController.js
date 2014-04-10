/*global define */


/**
 *
 * Created on 1/12/14.
 * @author ahamidev@gmail.com (Aston Hamilton)
 */
(function() {
  'use strict';

  define([
    'vendor/async',
    'classes/BucketQueue',
    'classes/LoaderState',
    'classes/Utility'
  ], function(Async, BucketQueue, LoaderState, Utility) {
    var GenericResourceListController;

    function buildGenericResourceListController(options, listId) {
      listId = listId || 'generic-list';

      return [
        '$scope', '$rootScope', '$state', '$stateParams', '$injector',
        function($scope, $rootScope, $state, $stateParams, $injector) {

          var pageSize = 15;

          $scope.records = [];

          $scope.currentPage = undefined;
          $scope.totalRecords = undefined;
          $scope.totalPages = undefined;
          $scope.loadingPage = undefined;
          $scope.recordLoader = new LoaderState();


          function loadRecords(pageIndex) {
            if ($scope.recordLoader.isLoading()) {
              return;
            }

            $scope.loadingPage = pageIndex;
            $scope.recordLoader.setLoading();
            options.loader({
              page: pageIndex,
              size: pageSize
            }, function(err, recordData) {
              if (err) {
                $scope.recordLoader.setFailed(undefined, err);

                if (!$scope.$$phase) {
                  $scope.$apply();
                }
                return;
              }

              $scope.records = recordData.records;
              $scope.totalPages = Math.ceil(recordData.total / pageSize);
              $scope.totalRecords = recordData.total;

              $scope.currentPage = pageIndex;

              $scope.recordLoader.setComplete();

              if (!$scope.$$phase) {
                $scope.$apply();
              }
            }, $scope, $rootScope, $state, $stateParams, $injector);
          }

          $scope.reloadRecords = function() {
            loadRecords($scope.currentPage);
          };

          $scope.loadNextPage = function() {
            var nextPage;

            nextPage = Utility.mod($scope.currentPage + 1, $scope.totalPages);
            loadRecords(nextPage);
          };

          $scope.loadPrevPage = function() {
            var nextPage;

            nextPage = Utility.mod($scope.currentPage - 1, $scope.totalPages);
            loadRecords(nextPage);
          };

          $scope.$on(listId + '/reload', function(e) {
            loadRecords($scope.currentPage);
          });

          (function bootstrap() {
            if (options.init) {
              options.init($scope, $rootScope, $state, $stateParams, $injector);
            }
            loadRecords(0);
          }());
        }];
    }

    GenericResourceListController = {
      build: buildGenericResourceListController
    };

    return GenericResourceListController;
  });
}());
