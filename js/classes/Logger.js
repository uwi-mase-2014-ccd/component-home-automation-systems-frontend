/*global define, console*/


/**
 *
 * @author ahamidev@gmail.com (Aston Hamilton)
 */
(function() {
  'use strict';


  define([
    'classes/Config',
    'classes/Utility',
    'vendor/debug'
  ], function(Config, Utility, Debug) {
    var Logger;

    function buildDebugger(suffix) {
      return Debug(Config.app.name ? Config.app.name + ':' + suffix : suffix);
    }

    var LoggerFunctions = {
      info: buildDebugger('info'),
      alert: buildDebugger('alert'),
      critical: buildDebugger('crit'),
      debug: buildDebugger('debug'),
      emergency: buildDebugger('emerg'),
      error: buildDebugger('error'),
      notice: buildDebugger('notice'),
      warn: buildDebugger('warn'),
      warning: buildDebugger('warn')
    };

    function generateLogger(level) {
      return function(message, errorObject) {
        (LoggerFunctions[level] ||
         LoggerFunctions.info)(message + (errorObject ? ' %s ' : ''),
                               (errorObject ? Utility.inspect(errorObject) : '')
        );
      };
    }

    Logger = {};
    Logger.info = generateLogger('info');
    Logger.alert = generateLogger('alert');
    Logger.critical = generateLogger('critical');
    Logger.debug = generateLogger('debug');
    Logger.emergency = generateLogger('emergency');
    Logger.error = generateLogger('error');
    Logger.notice = generateLogger('notice');
    Logger.warning = Logger.warn = generateLogger('warning');

    return Logger;
  });
}());
