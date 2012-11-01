// Makery.js v0.1
// (c) 2012 Leonardo Andres Garcia Crespo
// Distributed Under MIT License
(function() {

  var root = this,
      Makery;

  if (typeof exports !== "undefined") {
    Makery = exports;
  } else {
    Makery = root.Makery = {};
  }

  // Require Underscore, if we're on the server, and it's not already present.
  var _ = root._;
  if (!_ && (typeof require !== 'undefined')) _ = require('underscore');

  var helpers = {
        unique: function(value) {
          return _.uniqueId(value);
        }
      };

  function extractHooks(options) {
    // No-op default hooks
    var hooks = {
      afterCreation: function() {}
    };

    _.each(hooks, function(hook, hookKey) {
      if (options[hookKey]) {
        hooks[hookKey] = options[hookKey];
        delete options[hookKey];
      }
    });

    return hooks;
  }

  function addMakeMethodOn(ctor) {
    if (!_.isFunction(ctor.make)) {
      ctor.make = function(name, attrs) {
        if (arguments.length < 2) {
          if (!_.isString(name)) {
            attrs = name;
            name = "default";
          }
        }
        return ctor.make[name](attrs);
      }
    }
  }

  Makery.blueprint = function(ctor, name, options) {
    options = arguments.length === 3 ? options : name;
    name = arguments.length === 3 ? name : "default";

    addMakeMethodOn(ctor);

    var hooks = extractHooks(options);

    ctor.make[name] = function(attrs) {
      var ctorParams = {};

      // If the blueprint is not the default one, and a default one is defined,
      // use that blueprint's options as options for this one.
      if (name !== "default" && _.isFunction(ctor.make["default"])) {
        _.each(ctor.make["default"].options, function(value, key) {
          ctorParams[key] = _.isFunction(value) ?
            value :
            function() { return value; };
        });
      }

      _.each(options, function(value, key) {
        ctorParams[key] = _.isFunction(value) ?
          value :
          function() { return value; };
      });

      _.each(attrs, function(value, key) {
        ctorParams[key] = function() { return value; };
      });

      // include helpers so they can be called in the function properties
      var ctorParamsWithHelpers = _.extend({}, ctorParams, helpers);

      // iterate through ctorParams as we don't want to exec the helpers, but
      // exec every property using the context of the object with helpers.
      _.each(ctorParams, function(value, prop) {
        ctorParams[prop] = ctorParamsWithHelpers[prop]();
      });

      var obj = new ctor(ctorParams);

      hooks.afterCreation(obj);
      return obj;
    };

    // Make default options accesible, in case a named blueprint is defined.
    if (name === "default") {
      ctor.make[name].options = options;
    }
  };

}).call(this);