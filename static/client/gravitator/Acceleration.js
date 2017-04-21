!function () {

  class Acceleration {

    constructor(universe) {
      this.universe = universe;
    }

    calculate(objects, time) {
      let i;
      for (i = 0; i < objects.length; i++) {
        let object = objects[i];

        object.acceleration.x = object.force.x / object.mass;
        object.acceleration.y = object.force.y / object.mass;
        object.acceleration.z = object.force.z / object.mass;

        object.velocity.x += object.acceleration.x * time;
        object.velocity.y += object.acceleration.y * time;
        object.velocity.z += object.acceleration.z * time;
      }
    }

    init(object, definition) {
      object.velocity = {};
      if (definition.velocity) {
        object.velocity.x = definition.velocity.x || 0;
        object.velocity.y = definition.velocity.y || 0;
        object.velocity.z = definition.velocity.z || 0;
      }
      object.acceleration = {
        x: 0,
        y: 0,
        z: 0
      }
    }

  }

  if (typeof exports !== 'undefined') {
    module.exports = Acceleration;
  } else {
    window.gravitator = window.gravitator || {};
    window.gravitator.Acceleration = Acceleration;
  }

}();
