/*global define*/


/**
 *
 * @author ahamidev@gmail.com (Aston Hamilton)
 *
 *
 * parseUri 1.2.2
 * (c) Steven Levithan <stevenlevithan.com>
 * MIT License
 */
(function() {
  'use strict';

  define([
    'vendor/underscore'
  ], function(UnderscoreJS) {
    //noinspection JSDeclarationsAtScopeStart
    var Utility, SimpleDateRegEXP, monthNames;

    monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November',
      'December'
    ];

    SimpleDateRegEXP = new RegExp('^(\\d{1,2})/(\\d{1,2})/(\\d{4}) ' +
        '(\\d{1,2}):(\\d{1,2})(am|pm|AM|PM)$');
    Utility = UnderscoreJS;


    //Utility.str = require('underscore.string');

    /* ============== Parse URI =================== */
    function parseUri(str) {
      var o = parseUri.options,
          m = o.parser[o.strictMode ? 'strict' : 'loose'].exec(str),
          uri = {},
          i = 14;

      while (i--) {
        uri[o.key[i]] = m[i] || '';
      }

      uri[o.q.name] = {};
      uri[o.key[12]].replace(o.q.parser, function($0, $1, $2) {
        if ($1) {
          uri[o.q.name][$1] = $2;
        }
      });

      return uri;
    }

    parseUri.options = {
      strictMode: false,
      key: ['source', 'protocol', 'authority', 'userInfo', 'user',
            'password', 'host', 'port', 'relative', 'path', 'directory',
            'file', 'query', 'anchor'],
      q: {
        name: 'queryKey',
        parser: /(?:^|&)([^&=]*)=?([^&]*)/g
      },
      parser: {
        strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
        loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
      }
    };

    Utility.parseUri = parseUri;
    /* =============== End Parse URI ================== */
    (function initializeStringUtility() {
      var nativeTrim = String.prototype.trim,
          nativeTrimRight = String.prototype.trimRight,
          nativeTrimLeft = String.prototype.trimLeft,
          defaultToWhiteSpace = function(characters) {
            if (characters === null)
              return '\\s';
            else if (characters.source)
              return characters.source;
            else
              return '[' + Utility.str.escapeRegExp(characters) + ']';
          };

      Utility.str = {
        escapeRegExp: function(str) {
          if (str === null) return '';
          return String(str).replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
        },

        titleize: function(str) {
          if (str === null) return '';
          str = String(str).toLowerCase();
          return str.replace(/(?:^|\s|-)\S/g, function(c) {
            return c.toUpperCase();
          });
        },

        caseText: function(str) {
          return str.replace(/([A-Z]+)/g, ' $1')
                    .replace(/([A-Z][a-z])/g, ' $1');
        },

        trim: function(str, characters) {
          if (str === null) return '';
          if (!characters && nativeTrim) return nativeTrim.call(str);
          characters = defaultToWhiteSpace(characters);
          return String(str).replace(new RegExp('\^' + characters + '+|' + characters + '+$', 'g'), '');
        },

        ltrim: function(str, characters) {
          if (str === null) return '';
          if (!characters && nativeTrimLeft) return nativeTrimLeft.call(str);
          characters = defaultToWhiteSpace(characters);
          return String(str).replace(new RegExp('^' + characters + '+'), '');
        },

        rtrim: function(str, characters) {
          if (str === null) return '';
          if (!characters && nativeTrimRight) return nativeTrimRight.call(str);
          characters = defaultToWhiteSpace(characters);
          return String(str).replace(new RegExp(characters + '+$'), '');
        },

        truncate: function(str, length, truncateStr) {
          if (str === null) return '';
          str = String(str);
          truncateStr = truncateStr || '...';
          length = ~~length;
          return str.length > length ? str.slice(0, length) + truncateStr : str;
        }
      };
    }());

    Utility.mod = function(number, n) {
      return ((number % n) + n) % n;
    };

    Utility.getSimpleDateString = function(date, format) {
      format = format || ''; // For future use
      return date.getDate() + '/' + (date.getMonth() + 1) + '/' +
          date.getFullYear() + ' ' +
          ('0' + (date.getHours() % 12)).slice(-2) +
          ':' +
          ('0' + date.getMinutes()).slice(-2) +
          (date.getHours() > 12 ? 'PM' : 'AM');
    };


    Utility.isSimpleDateStringValid = function(dateString) {
      // Very Strict function
      // Accepted Type 1 : 19/10/2009 12:30PM (dd/MM/yyyy hh:mma)

      return SimpleDateRegEXP.test(dateString);
    };

    Utility.getSimpleDateParts = function(dateString) {
      var dateParts;

      if (!SimpleDateRegEXP.test(dateString)) {
        return false;
      }

      dateParts = dateString.match(SimpleDateRegEXP);

      return {
        year: parseInt(dateParts[3], 10),
        month: parseInt(dateParts[2], 10),
        day: parseInt(dateParts[1], 10),

        hour: parseInt(dateParts[4], 10),
        minute: parseInt(dateParts[5], 10),

        timeArea: String(dateParts[6]).toLowerCase()
      };
    };

    Utility.getDateFromSimpleDate = function(dateString) {
      var dateStringParts;

      dateStringParts = Utility.getSimpleDateParts(dateString);

      if (dateStringParts === false) {
        return false;
      }

      return new Date(
          dateStringParts.year,
          dateStringParts.month - 1,
          dateStringParts.day,
          dateStringParts.hour +
              (dateStringParts.timeArea === 'pm' &&
              dateStringParts.hour !== 12 ?
              12 : 0),
          dateStringParts.minute);

    };

    Utility.filterObject = function(obj, filterFunction) {
      var key, value, filteredObject;
      filteredObject = {};
      for (key in obj) {
        if (obj.hasOwnProperty(key)) {
          value = obj[key];
          if (filterFunction(value)) {
            filteredObject[key] = value;
          }
        }
      }

      return filteredObject;
    };

    Utility.generateUID = function() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    };

    Utility.generateGUID = function() {
      return Utility.generateUID() + Utility.generateUID() + '-' +
        Utility.generateUID() + '-' +
        Utility.generateUID() + '-' +
        Utility.generateUID() + '-' +
        Utility.generateUID() + Utility.generateUID() + Utility.generateUID();
    };

    Utility.getMonthName = function(monthIndex) {
      return monthNames[monthIndex];
    };

    return Utility;
  });
}());
