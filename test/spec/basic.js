describe("Basic usage", function() {
  describe("creating an object with blueprint defaults", function() {
    beforeEach(function() {
      this.Model = Backbone.Model.extend({});
      this.makeModel = function() {
        return this.Model.make();
      };
    });

    it("creates the object with blueprint simple properties", function() {
      Makery.blueprint(this.Model, {
        prop1: 1,
        prop2: 2
      });

      var model = this.makeModel();

      expect(model.get('prop1')).toEqual(1);
      expect(model.get('prop2')).toEqual(2);
    });

    it("execs blueprint function properties and assigns them to the object", function() {
      Makery.blueprint(this.Model, {
        prop1: function() { return 1; },
        prop2: function() { return "Hello World!"; }
      });

      var model = this.makeModel();

      expect(model.get('prop1')).toEqual(1);
      expect(model.get('prop2')).toEqual("Hello World!");
    });

    it("execs afterCreation hook when provided", function() {
      Makery.blueprint(this.Model, {
        prop1: function() { return "Something"; },
        afterCreation: function(obj) { obj.set('prop1', "Something modified!"); }
      });

      var model = this.makeModel();

      expect(model.get('prop1')).toEqual("Something modified!");
    });
  });

  describe("creating an object with blueprint overrides", function() {
    beforeEach(function() {
      this.Model = Backbone.Model.extend({});
      Makery.blueprint(this.Model, {
        prop1: "Some value",
        prop2: function() { return "Some other value"; }
      });
    });

    it("overrides the properties with simple ones", function() {
      var model = this.Model.make({
        prop1: "Modified",
        prop2: "Modified too"
      });

      expect(model.get('prop1')).toEqual("Modified");
      expect(model.get('prop2')).toEqual("Modified too");
    });

    it("function properties are not executed", function() {
      var overrides = {
        prop1: function() { return "Modified"; }
      };
      var model = this.Model.make(overrides);

      expect(model.get('prop1')).toEqual(overrides.prop1);
      expect(model.get('prop2')).toEqual("Some other value");
    });
  });

  describe("named blueprints", function() {
    beforeEach(function() {
      this.Model = Backbone.Model.extend({});

      Makery.blueprint(this.Model, {
        prop: "Prop",
        prop2: "The other prop"
      });

      Makery.blueprint(this.Model, "another", {
        prop: "Another Prop"
      });
    });

    it("creates the object with the default blueprint if no name specified", function() {
      expect(this.Model.make().get('prop')).toEqual('Prop');
    });

    it("creates the object with the default blueprint if default is specified", function() {
      expect(this.Model.make('default').get('prop')).toEqual('Prop');
    });

    it("creates the object with the blueprint identified by the specified name", function() {
      expect(this.Model.make('another').get('prop')).toEqual('Another Prop');
    });

    it("named blueprints use the default blueprint also if defined", function() {
      expect(this.Model.make('another').get('prop2')).toEqual('The other prop');
    });
  });
});