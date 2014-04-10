/*global define, GLOBAL_GROUP_PERMISSION_MAP */


/**
 *
 * Created on 1/31/14.
 * @author ahamidev@gmail.com (Aston Hamilton)
 */
(function() {
  'use strict';

  define(function() {
    var GroupPermissionsMap,

        _PERMISSION_MAP = GLOBAL_GROUP_PERMISSION_MAP,
        _PERMISSION_KEYS = null;


    function getPermissionKeys() {
      var group, permissionKey;

      if (_PERMISSION_KEYS === null) {
        _PERMISSION_KEYS = [];

        for (group in _PERMISSION_MAP) {
          if (_PERMISSION_MAP.hasOwnProperty(group)) {
            for (permissionKey in _PERMISSION_MAP[group]) {
              if (_PERMISSION_MAP[group].hasOwnProperty(permissionKey)) {
                _PERMISSION_KEYS.push(permissionKey);
              }
            }
          }
        }
      }

      return _PERMISSION_KEYS;
    }

    GroupPermissionsMap = {
      getPermissionKeys: getPermissionKeys
    };

    return GroupPermissionsMap;
  });
}());
