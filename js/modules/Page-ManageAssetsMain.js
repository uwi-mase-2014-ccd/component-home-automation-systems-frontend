/*global define */


/**
 *
 * @author ahamidev@gmail.com (Aston Hamilton)
 */

(function() {
  'use strict';

  define([
           'vendor/angular',
           'vendor/angular/router',
           'vendor/ui-utils',

           'classes/Logger',
           'classes/Utility',
           'classes/LoaderState',
           'classes/POJOStateFactory',

           'classes/controllers/GenericResourceListController',

           'repositories/AssetRepository',
           'repositories/UserRepository',

           'classes/angular-plugins/AHDebounce',

           'classes/angular-plugins/AHToast',
           'classes/angular-plugins/AHInitFocus',

           'classes/angular-plugins/AHFormValidatorMinMax',
           'classes/angular-plugins/AHFormValidatorMinLengthMaxLength',
           'classes/angular-plugins/AHFormValidatorRegexp',
           'classes/angular-plugins/AHFormValidatorPattern',
           'classes/angular-plugins/AHFormValidatorNumeric'
         ], function(
      angular, _, _2, Logger, Utility, LoaderState, POJOStateFactory,
      GenericResourceListController, AssetRepository, UserRepository) {

    var module;

    module = angular.module('Page/ManageAssets/Main', [
      'ui.router', 'ui.keypress', 'AH/Plugins'
    ]);

    module.config(
        [
          '$stateProvider', '$urlRouterProvider',
          function($stateProvider, $urlRouterProvider) {
            $urlRouterProvider
                .otherwise('/login');


            $stateProvider
                .state('login', {
                         url: '^/login',
                         templateUrl: 'html-partials/login.html'
                       })
                .state('devices', {
                         url: '^/devices',
                         templateUrl: 'html-partials/device-list.html',
                         controller: ['$scope', function($scope) {

                           $scope.checkAuthenticated();
                         }]
                       })
                .state('devices.new', {
                         url: '/create',
                         templateUrl: 'manage-assets/asset-create-asset.html'
                       })
                .state('devices.detail', {
                         url: '/{id}',
                         templateUrl: 'html-partials/device-detail.html'
                       })
                .state('devices.edit', {
                         url: '/{id}/edit',
                         templateUrl: 'manage-assets/asset-edit-details.html'
                       });

          }]);

    module.controller('ManageDevicesController', [
      '$scope', '$state', 'ahToast', function($scope, $state, Toast) {

        $scope.user = {
          username: '$tombstone#'
        };

        $scope.logout = function() {
          $scope.user = {
            username: '$tombstone#'
          };
          $state.go('login');
        };

        $scope.isLoggedIn = function() {
          return $scope.user.username !== '$tombstone#';
        };

        $scope.$watch('user', function(newUser) {
          if (!newUser) {
            return;
          }

          if (newUser.username === '$tombstone#') {
            $state.go('login');
          } else {
            $state.go('devices');
          }
        });

        $scope.goHome = function() {
          if ($scope.user.username === '$tombstone#') {
            $state.go('login');
          } else {
            $state.go('devices');
          }
        };


        $scope.setGlobalUser = function(user) {
          $scope.user = user;
        };

        $scope.checkAuthenticated = function() {
          if (!$scope.isLoggedIn()) {
            $scope.logout();
            Toast.error('You must first log in.')
          }
        };
      }]);

    module.controller('LoginFormController', [
      '$scope', 'ahToast',
      function($scope, Toast) {

        $scope.loginError = '';

        $scope.user = {
          username: '',
          password: ''
        };


        $scope.loginRequestLoader = new LoaderState();

        $scope.login = function() {
          if ($scope.loginRequestLoader.isLoading()) {
            return;
          }

          $scope.loginError = '';
          $scope.loginRequestLoader.setLoading();
          UserRepository.authenticateUser(
              $scope.user,
              function(err, user) {
                $scope.$apply(function() {
                  if (err) {
                    $scope.loginError = 'Invalid username and password';
                    $scope.loginRequestLoader.setFailed();
                    return;
                  }

                  $scope.setGlobalUser(user);
                  $scope.loginRequestLoader.setComplete();
                  Toast.success('Welcome ' + user.name);
                });
              });
        };
      }]);

    module.controller(
        'DeviceListController',
        GenericResourceListController.build(
            {
              loader: function(
                  query, cb, $scope, $rootScope, $state, $stateParams) {
                AssetRepository.getAssets(
                    {
                      page: query.page,
                      size: query.size
                    },
                    function(
                        err, recordData) {
                      if (err) {
                        Logger.error('The devices could not be fetched.',
                                     err);
                        $scope.Toast.error('The devices could not be loaded.');
                        cb(err);
                        return;
                      }

                      cb(undefined,
                         {
                           records: recordData.assets,
                           total: recordData.total
                         });
                    });
              }
            },
            'manage-devices/asset-list'));

    module.controller('ViewDeviceController', [
      '$scope', '$rootScope', '$stateParams', '$state', '$window', '$filter',
      'ahToast',
      function(
          $scope, $rootScope, $stateParams, $state, $window, $filter, Toast) {

        $scope.asset = undefined;

        $scope.assetLoader = new LoaderState();
        $scope.deleteRequestLoader = new LoaderState();
        $scope.deleteParentRequestLoader = new LoaderState();

        function loadAsset(assetId) {
          if ($scope.assetLoader.isLoading()) {
            return;
          }

          $scope.assetLoader.setLoading();

          AssetRepository
              .getAsset({ assetId: assetId }, function(err, data) {
                          $scope.$apply(function() {
                            if (err) {
                              Logger.error('Failed to Fetch Asset', err);
                              Toast.error('Could not load the asset.');
                              $scope.assetLoader.setFailed();
                              return;
                            }

                            $scope.asset = data.asset;
                            $scope.asset.values = Utility.sortBy(
                                $scope.asset.values,
                                function(value) {
                                  return value.title;
                                });
                            $scope.assetLoader.setComplete();
                          });
                        });
        }

        function deleteAsset(asset) {
          if ($scope.deleteRequestLoader.isLoading()) {
            return;
          }

          if (!$window.confirm(
                  'Are you sure you want to delete the device asset ' +
                  asset.name + '?')) {
            return;
          }

          $scope.deleteRequestLoader.setLoading();

          AssetRepository
              .removeAsset({ assetId: asset.id },
                           function(err/* ignored , data*/) {
                             $scope.$apply(function() {
                               if (err) {
                                 Logger.error('Failed to Remove Asset', err);
                                 Toast.error('Could not remove the asset.');
                                 $scope.deleteRequestLoader.setFailed();
                                 return;
                               }

                               //$scope.assetId = data.assetId;
                               $scope.deleteRequestLoader.setComplete();
                               $rootScope.$broadcast(
                                   'manage-assets/asset-list/reload');

                               if ($stateParams.categoryId) {
                                 $state
                                     .go('assets.records', {
                                           categoryId: $stateParams.categoryId
                                         });
                               } else {
                                 $state.go('assets');
                               }
                             });
                           });
        }

        $scope.getReadableValue = function(value) {
          if (value.type === 'simple-boolean') {
            return value.value === '1' ? 'Yes' : 'No';
          }

          return value.value;
        };

        $scope.deleteAsset = deleteAsset;


        (function bootstrap() {
          loadAsset($stateParams.id);
        }());
      }]);

    function buildAssetFormController(options) {
      return [
        '$scope', '$rootScope', '$state', '$stateParams', 'ahToast',
        function($scope, $rootScope, $state, $stateParams, Toast) {
          if (options.init) {
            options.init($scope, $rootScope, $state, $stateParams);
          }

          $scope.Toast = Toast;

          $scope.parentLoader = new LoaderState();
          $scope.categoryLoader = new LoaderState();
          $scope.saveRequestLoader = new LoaderState();

          $scope.parentHierarchy = [];

          $scope.categories = [];
          $scope.categoryListVisible = false;

          $scope.categoryNameTable = {};
          $scope.invertedCategoryNameTable = {};

          $scope.transientModel = {
            categoryName: ''
          };
          $scope.transientParentAsset = undefined;

          if (!$scope.asset) {
            $scope.asset = {
              title: '',
              description: '',
              flags: [],
              fields: [],
              template: [],
              values: []
            };
          }

          function buildRootPathList(leafNode) {
            var parentHierarchyList, currentNode;


            parentHierarchyList = [];

            currentNode = leafNode;

            while (currentNode) {
              parentHierarchyList.unshift(currentNode);
              currentNode = currentNode.parent;
            }

            return parentHierarchyList;
          }

          function addFieldDefinitionValue(asset, fieldDefinition) {
            var VALUE_MAP = {
              'boolean': 'simple-boolean',
              'float': 'simple-float',
              'integer': 'simple-int',
              'text': 'simple-string'
            }, newValue;

            if (!VALUE_MAP.hasOwnProperty(fieldDefinition.type)) {
              return;
            }

            newValue = {
              type: VALUE_MAP[fieldDefinition.type],
              fieldName: fieldDefinition.name,
              value: ''
            };

            POJOStateFactory
                .setState(newValue, 'fieldDefinition', fieldDefinition);

            asset.values.push(newValue);
          }

          function loadParentAsset(parentId) {
            if ($scope.parentLoader.isLoading()) {
              return;
            }

            $scope.parentLoader.setLoading();

            AssetRepository.getAsset({assetId: parentId}, function(err, data) {
              $scope.$apply(function() {
                if (err) {
                  Logger.error('Cannot load parent asset.', err);
                  Toast.error('Could not load the parent asset.');
                  $scope.parentLoader.setFailed();
                  return;
                }

                $scope.transientParentAsset = data.asset;
                $scope.parentLoader.setComplete();
              });
            });
          }

          function initializeAssetValues(asset, additionalFieldDefinitions) {
            var assetFields,
                fieldNameTable, fieldIdTable,
                definedFieldDefinitions, undefinedFieldDefinitions;

            if (additionalFieldDefinitions) {
              assetFields = additionalFieldDefinitions.concat(asset.fields);
            } else {
              assetFields = asset.fields;
            }


            fieldNameTable = Utility.indexBy(assetFields, 'name');
            fieldIdTable = Utility.indexBy(assetFields, 'id');

            Utility.each(asset.values, function(value) {
              var fieldDefinition;

              fieldDefinition = fieldIdTable[value.fieldDefinition.id];

              if (!fieldDefinition) {
                POJOStateFactory.setState(value, 'fieldDefinition', false);
              }

              POJOStateFactory.setState(value,
                                        'fieldDefinition',
                                        fieldDefinition);
            });

            asset.values = Utility.filter(asset.values, function(value) {
              return !!POJOStateFactory.getState(value, 'fieldDefinition');
            });

            definedFieldDefinitions =
            Utility.filter(
                Utility.map(asset.values, function(value) {
                  var fieldDefinition;

                  fieldDefinition = fieldIdTable[value.fieldDefinition.id];
                  if (fieldDefinition) {
                    return fieldDefinition.name;
                  }

                  return undefined;
                }), function(name) {
                  return !!name;
                });

            undefinedFieldDefinitions = Utility.difference(
                Utility.keys(fieldNameTable), definedFieldDefinitions);

            Utility.each(undefinedFieldDefinitions,
                         function(undefinedFieldName) {
                           var fieldDefinition;

                           fieldDefinition = fieldNameTable[undefinedFieldName];

                           addFieldDefinitionValue(asset, fieldDefinition);
                         });

            asset.values = Utility.sortBy(asset.values, function(value) {
              if (value.fieldDefinition) {
                return value.fieldDefinition.fieldOrder;
              }

              return asset.values.length;
            });
          }

          function removeFieldValue(asset, fieldDefinition) {
            asset.values = Utility.filter(asset.values, function(value) {
              if (value.fieldDefinition !== undefined) {
                return value.fieldDefinition.id !== fieldDefinition.id;
              }

              return value.fieldName !== fieldDefinition.name;
            });
          }

          function loadCategories() {
            if ($scope.categoryLoader.isLoading()) {
              return;
            }

            $scope.categoryLoader.setLoading();

            AssetCategoryNodeRepository.getAllCategoryLeafNodes(
                function(err, data) {
                  $scope.$apply(function() {
                    var categoryNameTable;
                    if (err) {
                      Logger.error('Failed to Load Categories', err);
                      Toast.error('Could not load the categories.');
                      $scope.categoryLoader.setFailed();
                      return;
                    }

                    categoryNameTable = {};
                    Utility.each(data.nodes, function(node) {
                      categoryNameTable[node.id] = node.fullPath;
                    });

                    $scope.categories = Utility.sortBy(
                        data.nodes,
                        function(node) {
                          return node.fullPath;
                        });

                    $scope.categoryNameTable = categoryNameTable;
                    $scope.invertedCategoryNameTable =
                    Utility.invert(categoryNameTable);


                    if (Utility.indexOf(options.flags,
                                        'load-default-category') > -1) {
                      if (!$scope.transientModel.categoryName &&
                          $stateParams.categoryId &&
                          $scope.categoryNameTable
                              .hasOwnProperty($stateParams.categoryId)) {
                        $scope.transientModel.categoryName =
                        $scope.categoryNameTable[
                            $stateParams.categoryId];
                      }
                    }

                    if ($scope.asset &&
                        $scope.asset.category && !$scope.asset.categoryId) {
                      $scope.asset.categoryId = $scope.asset.category.id;
                    }
                    $scope.categoryLoader.setComplete();
                  });
                });
          }

          $scope.$watch('asset', function(newAsset) {
            if (!newAsset) {
              return;
            }

            if (newAsset.parent) {

              $scope.parentHierarchy = buildRootPathList(newAsset.parent);

              if ($scope.parentHierarchy.length > 0) {
                $rootScope.currentRootAsset = $scope.parentHierarchy[0];
              }

              initializeAssetValues(newAsset, newAsset.parent.template);
            } else {
              initializeAssetValues(newAsset);
            }
          });

          $scope.$watch('transientParentAsset', function(newParentAsset) {
            if (!newParentAsset) {
              if ($scope.asset) {
                $scope.asset.parentId = undefined;
              }
              return;
            }

            if ($scope.asset) {
              $scope.asset.parent = newParentAsset;
              $scope.asset.parentId = newParentAsset.id;

              $scope.parentHierarchy = buildRootPathList(newParentAsset);

              if ($scope.parentHierarchy.length > 0) {
                $rootScope.currentRootAsset = $scope.parentHierarchy[0];
              }

              initializeAssetValues($scope.asset, newParentAsset.template);
            }
          });


          $scope.$watch('transientModel.categoryName', function(newCategory) {
            $scope.asset.categoryId =
            $scope.invertedCategoryNameTable[newCategory];
          });

          $scope.$watch('asset.category.id', function(newId) {
            $scope.asset.categoryId = newId;
          });

          $scope.$watch('asset.categoryId', function(newCategoryId) {
            if (newCategoryId === undefined) {
              return;
            }
            $scope.transientModel.categoryName =
            $scope.categoryNameTable[newCategoryId];
          });

          $scope.getFieldDefinition = function(fieldValue) {
            return POJOStateFactory.getState(fieldValue, 'fieldDefinition');
          };

          $scope.selectCategoryNode = function(asset, node) {
            asset.categoryId = node.id;
          };

          $scope.saveAsset = function() {
            if ($scope.assetForm.$invalid) {
              Logger.error(
                  'Unexpected Form Errors', $scope.assetForm.$error);
              Toast.error('There are errors in the form.');
              return;
            }

            if ($scope.asset.categoryId === undefined) {
              Logger.error('Category is not valid.');
              Toast.error('Please select a valid category.');
              return;
            }

            if (options.submit) {
              if (Utility.indexOf($scope.asset.flags, 'have-sub-assets') > -1) {
                options.submit($scope, $rootScope, $state, $stateParams,
                               $scope.asset);
              } else {
                options.submit($scope, $rootScope, $state, $stateParams,
                               Utility.omit($scope.asset, 'template'));
              }
            }
          };

          $scope.cancelSubmit = function() {
            if (options.cancel) {
              options.cancel($scope, $rootScope, $state, $stateParams,
                             $scope.asset);
            }
          };

          $scope.addField = function(asset, type, location) {
            var newFieldDefinition;
            if (!asset[location]) {
              asset[location] = [];
            }

            newFieldDefinition = {
              type: type,
              name: Utility.generateGUID(),
              title: '',
              required: '1',
              data: {}
            };

            asset[location].push(newFieldDefinition);

            if (location === 'fields') {
              addFieldDefinitionValue(asset, newFieldDefinition);
            }
          };


          $scope.isFieldOptionsVisible = function(field) {
            return !!POJOStateFactory.getState(field, 'options-visible');
          };

          $scope.toggleFieldOptions = function(field) {
            POJOStateFactory.toggleState(field, 'options-visible');
          };

          $scope.removeField = function(asset, field, location) {
            asset[location] = Utility.without(asset[location], field);


            if (location === 'fields') {
              removeFieldValue(asset, field);
            }
          };

          $scope.addCustomField = function(asset, fieldDefinition, location) {
            if (!asset[location]) {
              asset[location] = [];
            }

            fieldDefinition.name = 'custom-' + Utility.generateGUID();

            asset[location].push(fieldDefinition);

            if (location === 'fields') {
              addFieldDefinitionValue(asset, fieldDefinition);
            }
          };

          $scope.getFieldTemplate = function(field) {
            return 'manage-assets/asset-form-field-definition-' +
                   field.type + '.html';
          };

          $scope.getFieldValueTemplate = function(fieldValue) {
            return 'manage-assets/asset-form-field-value-' +
                   fieldValue.type + '.html';
          };

          $scope.getCategoryPanelHeight = function() {
            return $scope.categoryListVisible ?
                   Math.round(
                       (((($scope.categories.length / 3) + 1) * 25) + 90)) +
                   'px' :
                   '0px';
          };

          $scope.toggleCategoryPanel = function() {
            $scope.categoryListVisible = !$scope.categoryListVisible;
          };

          $scope.isAssetFlagSet = function(asset, flag) {
            if (!asset.flags) {
              asset.flags = [];
            }

            return Utility.indexOf(asset.flags, flag) > -1;
          };

          $scope.setAssetFlag = function(asset, flag) {
            if (!asset.flags) {
              asset.flags = [];
            }

            if (Utility.indexOf(asset.flags, flag) === -1) {
              asset.flags.push(flag);
            }
          };

          $scope.clearAssetFlag = function(asset, flag) {
            if (!asset.flags) {
              asset.flags = [];
            }

            asset.flags = Utility.without(asset.flags, flag);
          };

          $scope.isActionButtonGroupVisible = function(group) {
            return group.toUpperCase() === 'ALL' ||
                   ($rootScope.currentCategory &&
                    $rootScope.currentCategory.fullPath
                        .indexOf(group) > -1);
          };

          (function bootstrap() {
            loadCategories();
            initializeAssetValues($scope.asset);
            if ($stateParams.parentId) {
              loadParentAsset($stateParams.parentId);
            }
          }());
        }];
    }


    module.controller('NewAssetFormController',
                      buildAssetFormController({
                                                 flags: ['load-default-category'],
                                                 submit: function(
                                                     $scope, $rootScope, $state,
                                                     $stateParams, asset) {
                                                   if ($scope.saveRequestLoader.isLoading()) {
                                                     return;
                                                   }

                                                   $scope.saveRequestLoader.setLoading();

                                                   AssetRepository.createAsset(asset,
                                                                               function(
                                                                                   err,
                                                                                   data) {
                                                                                 $scope.$apply(function() {
                                                                                   if (err) {
                                                                                     Logger.error('Failed to Create Asset',
                                                                                                  err);
                                                                                     $scope.Toast.error('The asset could not be created.');
                                                                                     $scope.saveRequestLoader.setFailed();
                                                                                     return;
                                                                                   }

                                                                                   //$scope.asset = data.asset;
                                                                                   $scope.saveRequestLoader.setComplete();
                                                                                   $rootScope.$broadcast(
                                                                                       'manage-assets/asset-list/reload');

                                                                                   if (data.asset) {
                                                                                     $state
                                                                                         .go('assets.records.detail',
                                                                                             {
                                                                                               categoryId: $stateParams.categoryId ||
                                                                                                           (data.asset.category &&
                                                                                                            data.asset.category.id),
                                                                                               id: data.asset.id
                                                                                             });
                                                                                   } else if ($stateParams.parentId) {
                                                                                     $state
                                                                                         .go('assets.records.detail',
                                                                                             {
                                                                                               id: $stateParams.parentId
                                                                                             });
                                                                                   } else if ($stateParams.categoryId) {
                                                                                     $state.go('assets.records',
                                                                                               {
                                                                                                 categoryId: $stateParams.categoryId
                                                                                               });
                                                                                   } else {
                                                                                     $state.go('assets');
                                                                                   }
                                                                                 });
                                                                               });
                                                 },
                                                 cancel: function(
                                                     $scope, $rootScope, $state,
                                                     $stateParams, asset) {

                                                   if ($stateParams.parentId) {
                                                     $state
                                                         .go('assets.records.detail',
                                                             {id: $stateParams.parentId});
                                                   } else if ($stateParams.categoryId) {
                                                     $state
                                                         .go('assets.records',
                                                             {categoryId: $stateParams.categoryId});
                                                   } else {
                                                     $state
                                                         .go('assets');
                                                   }
                                                 }
                                               }));

    module.controller('EditAssetFormController',
                      buildAssetFormController({
                                                 init: function(
                                                     $scope, $rootScope, $state,
                                                     $stateParams) {
                                                   $scope.asset =
                                                   $stateParams.asset;
                                                   $scope.assetLoader =
                                                   new LoaderState();

                                                   function loadAsset(assetId) {
                                                     if ($scope.assetLoader.isLoading()) {
                                                       return;
                                                     }

                                                     $scope.assetLoader.setLoading();

                                                     AssetRepository
                                                         .getAsset({ assetId: assetId },
                                                                   function(
                                                                       err,
                                                                       data) {
                                                                     $scope.$apply(function() {
                                                                       if (err) {
                                                                         Logger.error('Failed to Fetch Asset',
                                                                                      err);
                                                                         $scope.Toast.error('The asset could not be loaded.');
                                                                         $scope.assetLoader.setFailed();
                                                                         return;
                                                                       }

                                                                       $scope.asset =
                                                                       data.asset;
                                                                       data.asset.fields =
                                                                       Utility.sortBy(
                                                                           data.asset.fields,
                                                                           function(fieldDefinition) {
                                                                             return fieldDefinition.sortOrder;

                                                                           });
                                                                       $scope.assetLoader.setComplete();
                                                                     });
                                                                   });
                                                   }

                                                   if (!$scope.asset) {
                                                     loadAsset($stateParams.id);
                                                   }
                                                 },
                                                 submit: function(
                                                     $scope, $rootScope, $state,
                                                     $stateParams, asset) {
                                                   if ($scope.saveRequestLoader.isLoading()) {
                                                     return;
                                                   }

                                                   $scope.saveRequestLoader.setLoading();

                                                   AssetRepository.updateAsset(asset,
                                                                               function(
                                                                                   err,
                                                                                   data) {
                                                                                 $scope.$apply(function() {
                                                                                   if (err) {
                                                                                     Logger.error('Failed to Update Asset',
                                                                                                  err);
                                                                                     $scope.Toast.error('The asset could not be updated.');
                                                                                     $scope.saveRequestLoader.setFailed();
                                                                                     return;
                                                                                   }

                                                                                   //$scope.asset = data.asset;
                                                                                   $scope.saveRequestLoader.setComplete();
                                                                                   $rootScope.$broadcast('manage-assets/asset-list/reload');
                                                                                   $state.go('assets.records.detail',
                                                                                             { id: asset.id });
                                                                                 });
                                                                               });
                                                 },
                                                 cancel: function(
                                                     $scope, $rootScope, $state,
                                                     $stateParams, asset) {
                                                   $state.go('assets.records.detail',
                                                             { id: asset.id });
                                                 }
                                               }));

    module.controller('TextFieldController', [
      '$scope',
      function($scope) {
        $scope.init = function(field) {
          $scope.$watch('field.data.pattern', function(newPattern) {
            POJOStateFactory
                .setState(field, 'patternConstraint', new RegExp(newPattern));
          });
        };
      }]);

    module.controller('TextFieldValueController', [
      '$scope',
      function($scope) {
        $scope.init = function(value) {
          value.value = value.value || '';
        };

        $scope.getPatternConstraint = function(field) {

          if (!POJOStateFactory.isStateSet(field, 'patternConstraint')) {
            POJOStateFactory
                .setState(field, 'patternConstraint',
                          new RegExp(field.data.pattern));
          }

          return POJOStateFactory.getState(field, 'patternConstraint');
        };
      }]);

    module.controller('IntegerFieldValueController', [
      '$scope',
      function($scope) {
        $scope.init = function(value) {
          value.value = value.value || 0;
        };
      }]);

    module.controller('FloatFieldValueController', [
      '$scope',
      function($scope) {
        $scope.init = function(value) {
          value.value = value.value || 0.0;
        };
      }]);

    module.controller('BooleanFieldValueController', [
      '$scope',
      function($scope) {
        $scope.init = function(value) {
          if (!value.value) {
            value.value = '1';
          }
        };

        $scope.isFieldValueSet = function(value) {
          return value.value === '1';
        };

        $scope.setFieldValue = function(value) {
          value.value = '1';
        };

        $scope.clearFieldValue = function(value) {
          value.value = '0';
        };
      }]);

    module.controller('AssetParentFormAssetSuggestionController', [
      '$scope',
      function($scope) {
        $scope.getAssetSuggestionLabel = function(asset) {
          return 'Asset ' + asset.id + ': ' + asset.title;
        };
      }]);

    module.controller('AssetParentFormController', [
      '$scope', '$rootScope', 'ahDebounce', 'ahToast',
      function($scope, $rootScope, ahDebounce, Toast) {
        var debouncedFetchAssetParents;

        $scope.formState = {
          transientParent: ''
        };

        $scope.asset = undefined;
        $scope.assetParents = [];
        $scope.assetParentIndex = [];

        $scope.saveRequestLoader = new LoaderState();
        $scope.suggestionsLoader = new LoaderState();

        debouncedFetchAssetParents = ahDebounce(function() {
          if ($scope.suggestionsLoader.isLoading()) {
            return;
          }

          $scope.suggestionsLoader.setLoading();
          AssetRepository.getAssetParentSearchResults(
              {
                query: $scope.formState.transientParent,
                limit: 10
              }, function(err, data) {
                $scope.$apply(function() {
                  if (err) {
                    Logger.error('Cannot load Asset Suggestions', err);
                    Toast.error('Cannot load Asset Suggestions');
                    $scope.suggestionsLoader.setFailed();
                    return;
                  }

                  $scope.assetParents = data.assets;
                  $scope.assetParentIndex = Utility.indexBy(data.assets, 'id');

                  POJOStateFactory.setState(
                      $scope.asset,
                      'newParent',
                      $scope.assetParentIndex[$scope.formState.transientParent]
                  );


                  $scope.suggestionsLoader.setComplete();
                });
              });
        }, 500);

        $scope.init = function(asset) {
          $scope.asset = asset;
          $scope.formState.transientParent = asset.parent && asset.parent.id;
        };

        $scope.getNewParent = function(asset) {
          return POJOStateFactory.getState(
              asset,
              'newParent'
          );
        };

        $scope.getAssetSuggestionLabel = function(asset) {
          if (!asset) {
            return 'No Asset Selected';
          }

          return 'Asset ' + asset.id + ': ' + asset.title;
        };

        $scope.$watch('formState.transientParent', function(newParent) {
          if (!newParent && newParent !== '') {
            return;
          }

          POJOStateFactory.setState(
              $scope.asset,
              'newParent',
              $scope.assetParentIndex[newParent]
          );


          debouncedFetchAssetParents();
        });

        $scope.saveAssetParent = function(asset) {
          var newAssetParent;
          if ($scope.saveRequestLoader.isLoading()) {
            return;
          }

          newAssetParent = POJOStateFactory.getState(asset, 'newParent');

          if (!newAssetParent) {
            Toast.error('Enter a valid asset number');
            return;
          }

          $scope.saveRequestLoader.setLoading();
          AssetRepository.updateAssetParent(
              {
                assetId: asset.id,
                parentId: newAssetParent.id
              }, function(err, data) {
                $scope.$apply(function() {
                  if (err) {
                    Logger.error('Could not update asset parent.', err);
                    Toast.error('Could not update asset parent.');
                    $scope.saveRequestLoader.setFailed();
                    return;
                  }

                  Utility.extend(asset, data.asset);
                  POJOStateFactory.setState(asset, 'editing-parent', false);
                  $scope.saveRequestLoader.setComplete();

                  POJOStateFactory.setState(asset, 'newParent', undefined);

                  $rootScope.$broadcast(
                      'manage-assets/asset-list/reload');
                });
              });
        };
      }]);

    return module;
  });
}());
