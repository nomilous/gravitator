!function () {

  class Existence {

    constructor(universe) {
      this.universe = universe;
    }

    init(object, definition) {
      object.mass = definition.mass || 1;
    }

  }

  if (typeof exports !== 'undefined') {
    module.exports = Existence;
  } else {
    window.gravitator = window.gravitator || {};
    window.gravitator.Existence = Existence;
  }

}();
