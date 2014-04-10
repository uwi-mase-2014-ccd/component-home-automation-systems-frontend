/*global define */


/**
 *
 * @author ahamidev@gmail.com (Aston Hamilton)
 */
(function() {
  'use strict';

  define(function() {
    // var POJOStateFactory;


    function getState(pojo, state) {
      return pojo._state && pojo._state[state];
    }

    function isStateSet(pojo, state) {
      return !!(pojo._state && pojo._state[state]);
    }

    function setState(pojo, state, value) {
      if (!pojo._state) {
        pojo._state = {};
      }

      pojo._state[state] = value;
    }

    function toggleState(pojo, state) {
      setState(pojo, state, !getState(pojo, state));
    }

    function removeAllStates(pojo) {
      pojo._state = undefined;
      delete pojo._state;
    }

    return {
      getState: getState,
      setState: setState,
      isStateSet: isStateSet,
      toggleState: toggleState,
      removeAllStates: removeAllStates
    };
  });
}());
