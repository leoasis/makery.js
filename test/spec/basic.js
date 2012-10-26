describe("Basic usage", function() {
  describe("creating an object with blueprint defaults", function() {
    beforeEach(function() {
      this.Model = Backbone.Model.extend({});
      this.makeModel = function() {
        return this.Model.make();
      };
    });

    it("creates the object when blueprint has simple properties", function() {
      Makery.blueprint(this.Model, {
        prop1: 1,
        prop2: 2
      });

      var model = this.makeModel();

      expect(model.get('prop1')).toEqual(1);
      expect(model.get('prop2')).toEqual(2);
    });

    it("creates the object when blueprint has function properties", function() {
      Makery.blueprint(this.Model, {
        prop1: function() { return 1; },
        prop2: function() { return "Hello World!"; }
      });

      var model = this.makeModel();

      expect(model.get('prop1')).toEqual(1);
      expect(model.get('prop2')).toEqual("Hello World!");
    });

    it("creates the object when blueprint has function properties", function() {
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

    it("overrides the properties with function ones", function() {
      var model = this.Model.make({
        prop1: function() { return "Modified"; },
        prop2: function() { return "Modified too"; }
      });

      expect(model.get('prop1')).toEqual("Modified");
      expect(model.get('prop2')).toEqual("Modified too");
    });

    it("execs the afterCreation hook when provided", function() {
      var model = this.Model.make({
        afterCreation: function(obj) {
          obj.set('prop1', "Modified after creation");
        }
      });

      expect(model.get('prop1')).toEqual("Modified after creation");
    });
  });

  describe("creating an object with afterCreation override", function() {
    beforeEach(function() {
      this.Model = Backbone.Model.extend({});
      Makery.blueprint(this.Model, {
        prop1: "Some value",
        afterCreation: function(obj) {
          obj.set('prop1', "Changed!!");
        }
      });
    });

    it("execs new the afterCreation hook when provided", function() {
      var model = this.Model.make({
        afterCreation: function(obj) {
          obj.set('prop1', "Overriden!");
        }
      });

      expect(model.get('prop1')).toEqual("Overriden!");
    });
  });
});