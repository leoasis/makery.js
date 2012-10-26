(function() {

  var root = this;

  if (typeof exports !== "undefined") {
    lib = exports;
  } else {
    lib = root.Makery = {};
  }

  // Require Underscore, if we're on the server, and it's not already present.
  var _ = root._;
  if (!_ && (typeof require !== 'undefined')) _ = require('underscore');

  var sequence = 1;

  function addHelpers(attrs) {
    var helpers = {
      seq: function() {
        return sequence++;
      }
    };

    return _.extend(attrs, helpers);
  }

  function getHooks(options) {
    var hooks = {},
        hookKeys = ['afterCreation'];

    _.each(hookKeys, function(hookKey) {
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
        attrs = arguments.length === 2 ? attrs : name;
        name = arguments.length === 2 ? name : "default";
        return ctor.make[name](attrs);
      }
    }

    var defaultHooks = {
      afterCreation: function() {}
    };

    var hooks = _.extend(defaultHooks, getHooks(options));

    ctor.make[name] = function(attrs) {
      attrs = _.extend({}, options, attrs);

      var hookOverrides = getHooks(attrs),
          finalHooks = _.extend({}, hooks, hookOverrides);

      var attrsWithHelpers = addHelpers(_.clone(attrs));
      _.each(attrs, function(value, prop) {
        attrs[prop] = _.result(attrsWithHelpers, prop);
      });

      var obj = new ctor(attrs);

      finalHooks.afterCreation(obj);
      return obj;
    };
  }

  lib.blueprint = function(ctor, name, options) {
    options = arguments.length === 3 ? options : name;
    name = arguments.length === 3 ? name : "default";

    addMakerFor(ctor, name, options);
  };

}).call(this);