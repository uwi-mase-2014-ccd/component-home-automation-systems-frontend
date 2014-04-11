/*global define */


/**
 *
 * @author ahamidev@gmail.com (Aston Hamilton)
 */
(function() {
  'use strict';

  define([
           'classes/http/APIClient',
           'classes/Router',
           'classes/Utility',
           'classes/JSONGenerator'
         ], function(
      APIClient, Router, Utility, JSONGenerator) {
    var AssetRepository;

    function getAssets(query, cb) {
      APIClient.post(
          "/component-device-management/src/read.php",
          {
            query: {
              categoryId: query.categoryId,
              limit: query.size,
              page: query.page
            }
          },
          function(err, data) {
            if (err) {
              cb({
                   message: 'The assets could not be retrieved.',
                   error: err
                 });
              return;
            }

            cb(undefined, {
              assets: data.data.devices
              });
          });
    }


    function getAsset(query, cb) {
      APIClient.get(
          "/component-device-management/src/read.php",
          {
            query: {
              id: query.assetId,
              limit: query.size,
              page: query.page
            }
          },
          function(err, data) {
            if (err) {
              cb({
                   message: 'The assets could not be retrieved.',
                   error: err
                 });
              return;
            }

            cb(undefined, {
              asset: data
              });
          });
    }


    function removeAsset(query, cb) {
      APIClient.del(
          Router.resolve('remove_asset', { assetId: query.assetId }),
          {},
          function(err, data) {
            if (err) {
              cb({
                   message: 'The asset could not be removed.',
                   error: err
                 });
              return;
            }

            cb(undefined, {
              assetId: data.assetId
            });
          });
    }

    function createAsset(asset, cb) {
      APIClient.post(Router.resolve('create_asset'), {
        data: {
          parentId: asset.parentId,
          title: asset.title,
          description: asset.description,
          categoryId: asset.parentId ? undefined : asset.categoryId,
          flags: asset.flags,
          fields: Utility.map(asset.fields, function(field, index) {
            return {
              id: field.id,
              type: field.type,
              name: field.name,
              fieldOrder: index,
              title: field.title,
              required: field.required,
              data: field.data
            };
          }),
          template: Utility.map(asset.template, function(field, index) {
            return {
              id: field.id,
              type: field.type,
              name: field.name,
              fieldOrder: index,
              title: field.title,
              required: field.required,
              data: field.data
            };
          }),
          values: Utility.map(asset.values, function(field, index) {
            return {
              id: field.id,
              type: field.type,
              fieldName: !field.id ? field.fieldName : undefined,
              value: field.value
            };
          })
        }
      }, function(err, data) {
        if (err) {
          cb({
               message: 'The asset could not be added.',
               error: err
             });
          return;
        }

        cb(undefined, {
          asset: data.asset
        });
      });
    }

    function updateAsset(asset, cb) {
      APIClient.put(Router.resolve('update_asset', { assetId: asset.id }),
                    {
                      data: {
                        title: asset.title,
                        description: asset.description,
                        categoryId: asset.parent ? undefined : asset.categoryId,
                        flags: asset.flags,
                        fields: Utility.map(asset.fields,
                                            function(field, index) {
                                              return {
                                                id: field.id,
                                                type: field.type,
                                                name: field.name,
                                                fieldOrder: index,
                                                title: field.title,
                                                required: field.required,
                                                data: field.data
                                              };
                                            }),
                        template: Utility.map(asset.template,
                                              function(field, index) {
                                                return {
                                                  id: field.id,
                                                  type: field.type,
                                                  name: field.name,
                                                  fieldOrder: index,
                                                  title: field.title,
                                                  required: field.required,
                                                  data: field.data
                                                };
                                              }),
                        values: Utility.map(asset.values,
                                            function(field, index) {
                                              return {
                                                id: field.id,
                                                type: field.type,
                                                fieldName: !field.id ?
                                                           field.fieldName :
                                                           undefined,
                                                value: field.value
                                              };
                                            })
                      }
                    }, function(err, data) {
            if (err) {
              cb({
                   message: 'The asset could not be updated.',
                   error: err
                 });
              return;
            }

            cb(undefined, {
              asset: data.asset
            });
          });
    }


    AssetRepository = {
      getAssets: getAssets,
      getAsset: getAsset,
      removeAsset: removeAsset,
      createAsset: createAsset,
      updateAsset: updateAsset
    };

    return AssetRepository;
  });
}());
