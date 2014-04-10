/*global define, GLOBAL_ROUTES*/


/**
 *
 * @author ahamidev@gmail.com (Aston Hamilton)
 */
(function() {
  'use strict';


  define([
    'classes/Utility'
  ], function(Utility) {
    var Router,

        _ROUTES = GLOBAL_ROUTES;


    function resolveRoute(route, data) {
      var resolvedRoute;

      if (!_ROUTES.hasOwnProperty(route)) {
        throw new Error('Cannot resolve route: ' + route, {
          route_name: route,
          route_data: data
        });
      }

      if (data !== undefined && !Utility.isObject(data)) {
        throw new Error('Route data should be an object', {
          route_name: route,
          route_data: data
        });
      }

      resolvedRoute = _ROUTES[route];

      resolvedRoute = (function resolveRouteParameters(route) {
        var parameter, parameterValue, resolvedRoute;

        resolvedRoute = route;
        for (parameter in data) {
          if (data.hasOwnProperty(parameter)) {
            parameterValue = data[parameter];
            resolvedRoute =
                resolvedRoute.replace(':' + parameter, parameterValue);
          }
        }

        return resolvedRoute;
      }(resolvedRoute));

      return resolvedRoute;
    }


    Router = {
      resolve: resolveRoute
    };

    return Router;
  });
}());
