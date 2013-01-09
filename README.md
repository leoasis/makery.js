makery.js
=========

[![Build Status](https://travis-ci.org/leoasis/makery.js.png?branch=master)](https://travis-ci.org/leoasis/makery.js)

Factory-style (via blueprints) object creation for tests. Inspired by Ruby Machinist.

Makery is a library that allows you to create objects with default values (and
possibly overriding those) via the definition of blueprints.

Makery works really well for creating Backbone models, but that is
not the only use case. Makery can be used to create any kind of objects from a
constructor.

How to install (web)
--------------

This library has [Underscore](http://underscorejs.org) as a single dependency. Simply put the underscore script before this one.

How to install (node)
--------------

```
npm install makery
```

How to use
----------

Makery has a short syntax for constructors that have a single options object
literal as a parameter. This is a very common way to create "Models", "Views"
and other entities in most frameworks out there.


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

Inside the function properties in the blueprint, you have access to helper functions, available directly though `this`. Available helpers:

- `unique`: gives you an incremental value each time, ideal for ids or unique properties. Optionally pass a prefix, to create unique properties of the type of
'prefixid'.

```js
Makery.blueprint(MyConstructor, {
  id: function() { return this.unique(); }
});

var obj = MyConstructor.make();
obj.id; // 0
var anotherObj = MyConstructor.make();
anotherObj.id; // 1
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
making objects to use them. Named blueprints will also use the default blueprint
 as a fallback for not defined properties.

```js
Makery.blueprint(MyConstructor, {
  aProperty: "This is the default blueprint",
  anotherProperty: "Still from the default blueprint"
});

Makery.blueprint(MyConstructor, "another blueprint", {
  aProperty: "This is another blueprint"
});

var obj = MyConstructor.make();
obj.aProperty; //"This is the default blueprint"
obj.anotherProperty; //"Still from the default blueprint"

obj = MyConstructor.make("another blueprint");
obj.aProperty; //"This is another blueprint"
obj.anotherProperty; //"Still from the default blueprint"
```

Makery has a little more verbose way to define a blueprint, by passing a
function as the last parameter of the definition. The return value of that
function must be the parameter to use for the constructor.

```js
Makery.blueprint(MyConstructor, function() {
  return {
    aProperty: "Some value",
    anotherProperty: "Another value"
  };
});

var obj = MyConstructor.make();
obj.aProperty; //"Some value"
obj.anotherProperty; //"Another value"
```

You can use `this` inside the function to get access to the helpers provided.

```js
Makery.blueprint(MyConstructor, function() {
  return {
    id: this.unique(),
    aProperty: "Some value",
    anotherProperty: "Another value"
  };
});

var obj = MyConstructor.make();
obj.id; //1
obj.aProperty; //"Some value"
obj.anotherProperty; //"Another value"
```

With this "more verbose" way to define blueprints, you can work with constructors
that have more than one parameter. To do this, just return an array with the
parameters in the correct order for that constructor.

```js
function MyMultiParamConstructor(param1, param2) {
  this.param1 = param1;
  this.param2 = param2;
}

Makery.blueprint(MyMultiParamConstructor, function() {
  return ["some param1 value", "some param2 value"];
});

var obj = MyMultiParamConstructor.make();
obj.param1; //"some param1 value"
obj.param2; //"some param2 value"
```

Changelog
---------

v0.2.0
- Named blueprints fallback to default blueprint if defined
- Multiple parameters

v0.1.0
- Basic blueprints functionality
- Support for afterCreation hook
- Support for function properties
- Named blueprints
