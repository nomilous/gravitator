!function () {

  class Motion {

    constructor(universe) {
      this.universe = universe;
    }

    calculate(objects, time) {
      objects.forEach(function (object) {
        object.position.x += object.velocity.x * time;
        object.position.y += object.velocity.y * time;
        object.position.z += object.velocity.z * time;
      });
    }

    init(object, definition) {
      if (definition.position) {
        object.position.x = definition.position.x || 0;
        object.position.y = definition.position.y || 0;
        object.position.z = definition.position.z || 0;
      }
    }

  }

  if (typeof exports !== 'undefined') {
    module.exports = Motion;
  } else {
    window.gravitator = window.gravitator || {};
    window.gravitator.Motion = Motion;
  }

}();
