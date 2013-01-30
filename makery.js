// Makery.js v0.2.0
// (c) 2013 Leonardo Andres Garcia Crespo
// Distributed Under MIT License
(function() {
  "use strict";

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

  function addPublicMakeTo(ctor) {
    if (!_.isFunction(ctor.make)) {
      ctor.make = function() {
        var params = arguments,
            name = "default",
            firstArg = _.first(arguments);

        if (_.isString(firstArg)) {
          name = firstArg;
          params = _.tail(arguments);
        }
        return ctor.make[name].apply(ctor.make, params);
      };
    }
  }

  function getSingleObjParam(ctor, name, option, attr) {
    var param = {};

    _.each(option, function(value, key) {
      param[key] = _.isFunction(value) ?
        value :
        function() { return value; };
    });

    _.each(attr, function(value, key) {
      param[key] = function() { return value; };
    });

    // include helpers so they can be called in the function properties
    var paramWithHelpers = _.extend({}, param, helpers);

    // iterate through param as we don't want to exec the helpers, but
    // exec every property using the context of the object with helpers.
    _.each(param, function(value, prop) {
      param[prop] = paramWithHelpers[prop]();
    });

    return param;
  }

  // We need a custom creation of an instance because we cannot
  // pass a dynamic amount of args into a constructor when calling them
  // with "new", so we must first call it with a fake constructor
  // with the same prototype and then apply the real one with the correct args.
  function createInstanceOf(ctor, args) {
    var tempCtor = function() {
      // This will return the instance or the explicit return of the ctor
      // accordingly.
      // Remember that if you return a primitive type, the constructor will
      // still return the object instance.
      return ctor.apply(this, args);
    };

    tempCtor.prototype = ctor.prototype;
    return new tempCtor();
  }

  function getDefaultOptions(ctor, name) {
    // If the blueprint is not the default one, and a default one is defined,
    // use that blueprint's options as options for this one.
    var defaultOptions =
      name !== "default" && _.isFunction(ctor.make["default"]) ?
        ctor.make["default"].getOptions() :
        {};
    // Always wrap default options in array, for consistent use
    if (!_.isArray(defaultOptions)) defaultOptions = [defaultOptions];
    return defaultOptions;
  }

  Makery.blueprint = function(ctor, name, options) {
    options = arguments.length === 3 ? options : name;
    name = arguments.length === 3 ? name : "default";

    addPublicMakeTo(ctor);

    var usingFunction = _.isFunction(options),
        getOptions = usingFunction ?
          _.bind(options, helpers) :
          function() { return _.clone(options); };

    ctor.make[name] = function() {
      var attrs = arguments,
          defaultOptions = getDefaultOptions(ctor, name),
          options = getOptions(),
          hooks = extractHooks(options),
          ctorParams = [];

      // Multiple parameters in constructor
      if (usingFunction && _.isArray(options)) {
        _.each(options, function(option, index) {
          ctorParams.push(attrs[index] || option || defaultOptions[index]);
        });
      } else { // Single object parameter
        options = _.extend(defaultOptions[0], options);
        ctorParams.push(getSingleObjParam(ctor, name, options, attrs[0]));
      }

      var obj = createInstanceOf(ctor, ctorParams);

      hooks.afterCreation(obj);
      return obj;
    };

    // Make default options accesible, in case a named blueprint is defined.
    if (name === "default") {
      ctor.make[name].getOptions = _.isFunction(options) ?
        _.bind(options, helpers) :
        function() {return _.clone(options); };
    }
  };

}).call(this);