describe("Parameters", function() {

  describe("parameters wrapped in function", function() {
    beforeEach(function() {
      this.Constructor = function (options) {
        this.options = options;
      };

      Makery.blueprint(this.Constructor, function() {
        return {
          prop1: "value",
          prop2: "another value"
        }
      });
    });

    it("creates an object with those properties set", function() {
      var obj = this.Constructor.make();
      expect(obj.options.prop1).toEqual("value");
      expect(obj.options.prop2).toEqual("another value");
    });

    it("creates an object with the overriden properties", function() {
      var obj = this.Constructor.make({
        prop2: "modified value"
      });
      expect(obj.options.prop1).toEqual("value");
      expect(obj.options.prop2).toEqual("modified value");
    });
  });

  describe("multiple parameters", function() {
    describe("two parameters", function() {
      beforeEach(function() {
        this.Constructor = function (array, options) {
          this.array = array;
          this.options = options;
        };

        Makery.blueprint(this.Constructor, function() {
          return [[{
              id: this.unique()
            }, {
              id: this.unique()
            }, {
              id: this.unique()
            }], {
              prop1: "A value!"
          }];
        });
      });

      it("creates the object with those two defaults", function() {
        var obj = this.Constructor.make();
        expect(obj.array.length).toBe(3);
        expect(obj.options.prop1).toBe("A value!");
      });

      it("allows to use the helpers inside the function", function() {
        var obj = this.Constructor.make();

        var ids = _.map(obj.array, function(item) {return item.id;});

        expect(ids[0]).not.toEqual(ids[1]);
        expect(ids[1]).not.toEqual(ids[2]);
        expect(ids[2]).not.toEqual(ids[0]);
      });

      it("creates the object with the overriden parameter and the rest of the defaults", function() {
        var obj = this.Constructor.make([{}]);

        expect(obj.array.length).toBe(1);
        expect(obj.options.prop1).toBe("A value!");
      });

      it("allows setting undefined to use the default for a parameter", function() {
        var obj = this.Constructor.make(undefined, {prop1: "Modified!"});

        expect(obj.array.length).toBe(3);
        expect(obj.options.prop1).toBe("Modified!");
      });
    });
  });
});