/*global */


/**
 *
 * @author ahamidev@gmail.com (Aston Hamilton)
 */
(function() {
  'use strict';

  define(['vendor/chancejs'], function(Chance) {
    var JSONGenerator;


    var ARG_REGEXP = /(\\,||[^,])+/g;

    var generatorInst = new Chance();

    var SECONDARY_FX = {
      identity: function(value) {
        return value;
      }
    };

    if (!String.prototype.trim) {
      String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, '');
      };

      String.prototype.ltrim = function() {
        return this.replace(/^\s+/, '');
      };

      String.prototype.rtrim = function() {
        return this.replace(/\s+$/, '');
      };

      String.prototype.fulltrim = function() {
        return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, '').replace(/\s+/g,
                                                                        ' ');
      };
    }

    JSONGenerator = {};

    JSONGenerator.getRandomValue = function(schemaValue) {
      var schemaParts, fx, args;

      schemaParts = schemaValue.split(':');
      fx = schemaParts[0];

      if (schemaParts.length > 1) {
        args = (function filterValidArgs(args) {
          var i, filteredArgs;

          filteredArgs = [];
          for (i = 0; i < args.length; i += 1) {
            if (args[i].length > 0) {
              filteredArgs.push(args[i]);
            }
          }

          return filteredArgs;
        }(schemaParts[1].match(ARG_REGEXP)));

        if (args.length > 0 && args[0].indexOf('->') > -1) {
          args = [
            (function inflateArgsObject(args) {
              var inflatedArgsObject, objectParts, i;

              objectParts = [];

              inflatedArgsObject = {};

              for (i = 0; i < args.length; i += 1) {
                objectParts = args[i].split('->');
                if (objectParts.length !== 2) {
                  throw new Error('Invalid Arguments. Value: ' + schemaValue);
                }

                inflatedArgsObject[objectParts[0].trim()] = objectParts[1].trim();
              }

              return inflatedArgsObject;
            }(args))];
        }
      } else {
        args = [];
      }

      if (generatorInst[fx]) {
        return generatorInst[fx].apply(generatorInst, args);
      }

      return SECONDARY_FX[fx].apply(SECONDARY_FX, args);
    };

    JSONGenerator.generateObject = function(schema) {
      var generatedObject, minEntries, maxEntries, directiveParts, key;

      if (Array.isArray(schema)) {
        directiveParts = schema[0].split(':');
        if (directiveParts.length > 1) {
          minEntries = parseInt(directiveParts[1].split(',')[0], 10);
          maxEntries = parseInt(directiveParts[1].split(',')[1], 10);
        } else {
          minEntries = 1;
          maxEntries = generatorInst.integer({min: 1, max: 100});
        }

        generatedObject = (function generateArrayEntries(min, max, schema) {
          var arr, i, len;

          arr = [];
          len = generatorInst.integer({min: min, max: max});

          for (i = 0; i < len; i += 1) {
            arr.push(JSONGenerator.generateObject(schema));
          }

          return arr;
        }(minEntries, maxEntries, schema[1]));

      } else {
        generatedObject = {};

        for (key in schema) {
          if (schema.hasOwnProperty(key)) {
            if (typeof schema[key] === 'string') {
              generatedObject[key] = JSONGenerator.getRandomValue(schema[key]);
            } else if (typeof schema[key] === 'object') {
              generatedObject[key] = JSONGenerator.generateObject(schema[key]);
            } else {
              generatedObject[key] = schema[key];
            }
          }
        }
      }

      return generatedObject;
    };

    JSONGenerator.generateJSON = function(schema) {
      return JSON.stringify(JSONGenerator.generateObject(schema));
    };

    return JSONGenerator;
  });
}());
