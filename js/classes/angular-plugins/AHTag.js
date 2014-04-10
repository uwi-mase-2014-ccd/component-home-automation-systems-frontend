/*global require */


/**
 *
 * Created on 12/28/13.
 * @author ahamidev@gmail.com (Aston Hamilton)
 */
(function() {
  'use strict';


  function TaggedElementStorage() {
    var self = this;

    self._storage = {};

    self.add = function(key, el) {
      var self = this;

      if (self._storage.hasOwnProperty(key)) {
        self._storage[key].push(el);
      } else {
        self._storage[key] = [el];
      }
    };

    self.get = function(key) {
      var self = this;

      if (self._storage.hasOwnProperty(key)) {
        return self._storage[key];
      }

      return [];
    };

    self.each = function(key, cb) {
      var self = this,
          matchedElements, i;


      if (self._storage.hasOwnProperty(key)) {
        matchedElements = self._storage[key];
        for (i = 0; i < matchedElements.length; i += 1) {
          cb.call(self, matchedElements[i]);
        }
      }

      return matchedElements;
    };
  }

  require([
    'modules/AH-Plugins'
  ], function(module) {

    module.factory('ahTag', function() {
      return new TaggedElementStorage();
    });

    module.directive('ahTag', [
      'ahTag',
      function(TagData) {
        function link(scope, element, attrs) {
          TagData.add(attrs.ahTag, element);
        }

        return {
          link: link
        };
      }]);
    return {};
  });
}());
