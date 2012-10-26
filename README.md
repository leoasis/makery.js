makery.js
=========

Factory-style (via blueprints) object creation for tests. Inspired by Ruby Machinist.

Makery is a library that allows you to create objects with default values (and
possibly overriding those) via the definition of blueprints.

The objects need to have a constructor that receives an options hash as
single parameter. This constraint is to be removed in future versions.

How to install
==============

This library has a single dependency that is Underscore [http://underscorejs.org/]. Simply put underscore script before this one.

Also this library should work in node. Still haven't tested it, so let me know if you find any issues. This will be supported in the future.

How to use
==========

Define the blueprints for the constructor

```javascript
Makery.blueprint(MyConstructor, {
  aProperty: "Default value for property",
  someOtherProperty: false
});
```

Now create the object

```javascript
var obj = MyConstructor.make();
obj.aProperty; // "Default value for property"
obj.someOtherProperty; // false
```

You can override the defaults

```javascript
var obj = MyConstructor.make({
  someOtherProperty: true
});
obj.aProperty; // "Default value for property"
obj.someOtherProperty; // true
```

You can use functions to build up the properties, both in the blueprint and in the overrides

```javascript
Makery.blueprint(MyConstructor, {
  aProperty: function() { return "Default value for property"; },
  someOtherProperty: false
});

var obj = MyConstructor.make({
  someOtherProperty: function() { return true; }
});
obj.aProperty; // "Default value for property"
obj.someOtherProperty; // true
```

Changelog
=========

v0.1
- Basic blueprints functionality
- Support for afterCreation hook
- Support for function properties