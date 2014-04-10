/*global define */


/**
 *
 * @author ahamidev@gmail.com (Aston Hamilton)
 */
(function() {
  'use strict';


  define([
    'vendor/angular',
    'classes/Utility',
    'classes/Router',
    'classes/Config'
  ], function(angular, Utility, Router, Config) {

    //noinspection JSDeclarationsAtScopeStart
    var APIClient,

        /* Required Utils */
        $injector = angular.injector(['ng']),

        /* Required Libs */
        HTTP = $injector.get('$http');

    HTTP.defaults.cache = false;

    function buildQueryString(queryStringData) {
      var queryString;

      if (Config.app.debug) {
        queryStringData.XDEBUG_SESSION_START = 'PHPSTORM-XDEBUG';
      }

      queryString = Utility.chain(queryStringData)
        .pairs()
        .reduce(
          function(queryString, currentDataItem, index) {
            var key, value;

            key = currentDataItem[0];
            value = currentDataItem[1];

            if (Utility.isUndefined(value)) {
              return queryString;
            }

            if (queryString === '') {
              queryString += '?';
            } else {
              queryString += '&';
            }

            if (Utility.isArray(value)) {
              queryString += Utility.reduce(value,
                  function(currentSubQueryString, element, index) {
                    currentSubQueryString += (index === 0 ? '' : '&') +
                      key + '[]=' + encodeURIComponent(element);


                    return currentSubQueryString;
                  }, '');
            } else {
              queryString += key + '=' + encodeURIComponent(value);
            }


            return queryString;
          }, '')
        .value();

      return queryString;
    }

    function checkValidAPIResponse(response, cb) {
      if (!Utility.isObject(response)) {
      	try {
      	response = JSON.parse(response);
      	} catch (e) {
        cb({
          response: response,
          message: 'API Response Is Not JSON Object'
        }, undefined);
        return;
        }
      }

/*
      if (Utility.isUndefined(response.code) ||
          Utility.isUndefined(response.data)) {
        cb({
          response: response,
          message: 'API Response Object Has Invalid Structure'
        }, undefined);
        return;
      }

      if (response.code !== 200) {
        cb({
          response: response,
          message: 'The Request was not valid'
        }, undefined);
        return;
      }
      */

      cb(undefined, response);
    }

    function sendGetRequest(url, passedOptions, cb) {
      var options, queryString;

      options = Utility.extend({
        query: {}
      }, passedOptions);

      queryString = buildQueryString(options.query);

      HTTP.get(url + queryString)
        .success(function(response) {
            checkValidAPIResponse(response, cb);
          })
        .error(function(response) {
            cb({
              error: {
                response: response,
                status: response.status,
                headers: response.headers,
                config: response.config
              },
              message: 'Request Failed To Execute'
            }, undefined);
          });
    }

    function sendDeleteRequest(url, passedOptions, cb) {
      var options, queryString;

      options = Utility.extend({
        query: {}
      }, passedOptions);

      queryString = buildQueryString(options.query);

      HTTP['delete'](url + queryString)
        .success(function(response) {
            checkValidAPIResponse(response, cb);
          })
        .error(function(response) {
            cb({
              error: {
                response: response,
                status: response.status,
                headers: response.headers,
                config: response.config
              },
              message: 'Request Failed To Execute'
            }, undefined);
          });
    }

    function sendPostRequest(url, passedOptions, cb) {
      var options, queryString;

      options = Utility.extend({
        query: {},
        data: {}
      }, passedOptions);

      queryString = buildQueryString(options.query);

      HTTP.post(url + queryString, options.data)
        .success(function(response) {
            checkValidAPIResponse(response, cb);
          })
        .error(function(response) {
            cb({
              error: {
                response: response,
                status: response.status,
                headers: response.headers,
                config: response.config
              },
              message: 'Request Failed To Execute'
            }, undefined);
          });
    }

    function sendPutRequest(url, passedOptions, cb) {
      var options, queryString;

      options = Utility.extend({
        query: {},
        data: {}
      }, passedOptions);

      queryString = buildQueryString(options.query);

      HTTP.put(url + queryString, options.data)
        .success(function(response) {
            checkValidAPIResponse(response, cb);
          })
        .error(function(response) {
            cb({
              error: {
                response: response,
                status: response.status,
                headers: response.headers,
                config: response.config
              },
              message: 'Request Failed To Execute'
            }, undefined);
          });
    }


    APIClient = {
      get: sendGetRequest,
      put: sendPutRequest,
      post: sendPostRequest,
      del: sendDeleteRequest
    };

    return APIClient;
  });
}());
