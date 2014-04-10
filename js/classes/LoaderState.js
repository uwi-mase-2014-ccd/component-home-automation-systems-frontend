/*global define */


/**
 *
 * @author ahamidev@gmail.com (Aston Hamilton)
 *
 */
(function() {
  'use strict';

  define([
  ], function() {
    var LoaderState;

    LoaderState = function() {
      var self = this;


      self._isLoadingFlag = false;
      self._isFailedFlag = false;
      self._failedReason = '';
      self._failedErrorData = {};
    };

    LoaderState.prototype.isLoading = function() {
      var self = this;

      return self._isLoadingFlag;
    };

    LoaderState.prototype.isComplete = function() {
      var self = this;

      return !self._isLoadingFlag;
    };

    LoaderState.prototype.isFailed = function() {
      var self = this;

      return self._isFailedFlag;
    };

    LoaderState.prototype.isSucceed = function() {
      var self = this;

      return !self._isFailedFlag && !self._isLoadingFlag;
    };


    LoaderState.prototype.setFailed = function(reason, errData) {
      reason = reason || '';
      errData = errData || {};

      var self = this;

      self._isLoadingFlag = false;
      self._isFailedFlag = true;
      self._failedReason = reason;
      self._failedErrorData = errData;
    };


    LoaderState.prototype.setComplete = function() {
      var self = this;

      self._isLoadingFlag = false;
    };

    LoaderState.prototype.setLoading = function() {
      var self = this;

      self._isLoadingFlag = true;
      self._isFailedFlag = false;
    };

    return LoaderState;
  });
}());
