!function () {

  var THREE;

  if (typeof require === 'function') {
    THREE = require('three');
  } else {
    THREE = window.THREE;
  }

  class Gravitation {

    constructor(universe) {
      this.universe = universe;
    }

    calculate(objects) {
      let i, j;

      for (i = 0; i < objects.length; i++) {
        let object = objects[i];
        this.init(object);
      }

      for (i = 0; i < objects.length; i++) {
        for (j = 0; j < i; j++) {
          let forceVector = new THREE.Vector3();
          let object1 = objects[i];
          let object2 = objects[j];

          let mass = object1.mass * object2.mass;
          let distance = object1.position.distanceTo(object2.position);
          let force = (this.universe.g * mass) / distance;

          forceVector = forceVector.subVectors(object1.position, object2.position);
          forceVector.normalize();
          forceVector.multiplyScalar(force);

          object1.force.x -= forceVector.x;
          object1.force.y -= forceVector.y;
          object1.force.z -= forceVector.z;

          object2.force.x += forceVector.x;
          object2.force.y += forceVector.y;
          object2.force.z += forceVector.z;
        }
      }
    }

    init(object) {
      if (object.force) {
        object.force.x = 0;
        object.force.y = 0;
        object.force.z = 0;
        return;
      }
      object.force = {
        x: 0,
        y: 0,
        z: 0
      }
    }

  }

  if (typeof exports !== 'undefined') {
    module.exports = Gravitation;
  } else {
    window.gravitator = window.gravitator || {};
    window.gravitator.Gravitation = Gravitation;
  }

}();
