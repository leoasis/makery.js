makery.js
=========

Factory-style (via blueprints) object creation for tests. Inspired by Ruby Machinist.

Makery is a library that allows you to create objects with default values (and
possibly overriding those) via the definition of blueprints.

Makery works really well for creating Backbone models, but that is
not the only use case. Makery can be used to create any kind of objects from a
constructor.
Right now the objects need to have a constructor that receives an options hash as
single parameter. This constraint is to be removed in future versions.

How to install
--------------

This library has [Underscore](http://underscorejs.org) as a single dependency. Simply put the underscore script before this one.

Also this library should work in node. Still haven't tested it, so let me know if you find any issues. This will be supported in the future, with an npm package
coming.

How to use
----------

Define the blueprints for the constructor

```js
Makery.blueprint(MyConstructor, {
  aProperty: "Default value for property",
  someOtherProperty: false
});
```

Now create the object

```js
var obj = MyConstructor.make();
obj.aProperty; // "Default value for property"
obj.someOtherProperty; // false
```

You can override the defaults

```js
var obj = MyConstructor.make({
  someOtherProperty: true
});
obj.aProperty; // "Default value for property"
obj.someOtherProperty; // true
```

You can use functions to build up the properties in the blueprint. This is
useful for creating new instances each time for a property.

```js
Makery.blueprint(MyConstructor, {
  aProperty: function() { return [1, 2, 3]; },
  someOtherProperty: false
});

var obj = MyConstructor.make();
obj.aProperty; // [1, 2, 3]
```

Inside the function properties in the blueprint, you have access to helper functions, available directly though `this`. Currently only `seq` is supported, which will give you
an incremental value each time, ideal for ids or unique properties.

```js
Makery.blueprint(MyConstructor, {
  id: function() { return this.seq(); }
});

var obj = MyConstructor.make();
obj.id; // 1
var anotherObj = MyConstructor.make();
anotherObj.id; // 2
```

Also there is an `afterCreation` hook available in the blueprints, to do any
kind of action with the just created object.

```js
Makery.blueprint(MyConstructor, {
  aProperty: "The value of this property",
  afterCreation: function(obj) {
    obj.otherProperty = "Another value";
  }
});

var obj = MyConstructor.make();
obj.aProperty; // "The value of this property"
obj.otherProperty; // "Another value"
```

Multiple blueprints for the same constructor can be defined. An unnamed blueprint
will be the default one, but you can name blueprints and specify that name when
making objects to use them.

```js
Makery.blueprint(MyConstructor, {
  aProperty: "This is the default blueprint"
});

Makery.blueprint(MyConstructor, "another blueprint", {
  aProperty: "This is another blueprint"
});

var obj = MyConstructor.make();
obj.aProperty; //"This is the default blueprint"

obj = MyConstructor.make("another blueprint");
obj.aProperty; //"This is another blueprint"
```

Changelog
---------

v0.1
- Basic blueprints functionality
- Support for afterCreation hook
- Support for function properties
- Named blueprints