/*global define*/


/**
 *
 * Created on 1/6/14.
 * @author ahamidev@gmail.com (Aston Hamilton)
 */
(function() {
  'use strict';

  define(function() {
    var BucketQueue;

    BucketQueue = function(options) {
      var self = this;

      self._bucketSize = options.size || 15;
      self._queueLength = options.maxCount || 3;

      self._items = [];
    };

    BucketQueue.prototype.addBucket = function(bucket) {
      var self = this;

      // My Elegant Bucket Queue
      if (self._items.length > ((self._queueLength - 1) * self._bucketSize)) {
        self._items.slice(0, self._bucketSize);
      }

      self._items.push.apply(self._items, bucket);
    };

    BucketQueue.prototype.getItems = function() {
      var self = this;

      return self._items;
    };


    return BucketQueue;
  });

}());
