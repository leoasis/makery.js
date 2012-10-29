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

  var sequence = 1,
      helpers = {
        seq: function() {
          return sequence++;
        }
      };

  function getHooks(options) {
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

  function addMakerFor(ctor, name, options) {
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

    var hooks = getHooks(options);

    ctor.make[name] = function(attrs) {
      var ctorParams = {};
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
      _.each(ctorParams, function(value, prop) {
        ctorParams[prop] = ctorParamsWithHelpers[prop]();
      });

      var obj = new ctor(ctorParams);

      hooks.afterCreation(obj);
      return obj;
    };
  }

  Makery.blueprint = function(ctor, name, options) {
    options = arguments.length === 3 ? options : name;
    name = arguments.length === 3 ? name : "default";

    addMakerFor(ctor, name, options);
  };

}).call(this);