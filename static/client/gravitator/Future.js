!function () {

  var THREE;

  if (typeof require === 'function') {
    THREE = require('three');
  } else {
    THREE = window.THREE;
  }

  class Future {

    constructor(universe) {
      this.universe = universe;
    }

    calculate(objects, time) {
      if (!this.universe.params.future) return;

      this.futureObjects= [];
      objects.forEach(object => {
        let futureObject = {
          object: object
        };
        futureObject.position = object.position.clone();
        this.universe.existence.init(futureObject, object);
        this.universe.acceleration.init(futureObject, object);
        this.futureObjects.push(futureObject);
      });

      for (let i = 0; i < this.universe.params.future; i++) {
        this.universe.gravitation.calculate(this.futureObjects);
        this.universe.acceleration.calculate(this.futureObjects, time);
        this.universe.motion.calculate(this.futureObjects, time);

        this.futureObjects.forEach(futureObject => {
          let object = futureObject.object;
          if (!object.future) return;

          let accum = object.future.accum;
          accum[i] = {
            x: futureObject.position.x,
            y: futureObject.position.y,
            z: futureObject.position.z
          };
        });
      }

      objects.forEach(object => {
        if (!object.future) return;

        let accum = object.future.accum;
        let positions = object.future.geometry.attributes.position.array;
        let index = 0;
        let i;

        for (i = 0; i < accum.length; i++) {
          let vertex = accum[i];
          positions[index++] = vertex.x;
          positions[index++] = vertex.y;
          positions[index++] = vertex.z;
        }

        object.future.geometry.attributes.position.needsUpdate = true;
      });
    }

    init(object, definition) {
      if (!this.universe.params.future) return;
      if (definition.noFuture) return;

      let material = new THREE.LineBasicMaterial({color: 0x777777, linewidth: 1});
      let geometry = new THREE.BufferGeometry();
      let positions = new Float32Array(this.universe.params.future * 3);

      geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setDrawRange(0, this.universe.params.future);

      let line = new THREE.Line(geometry, material);
      object.future = line;
      object.future.accum = [];
      this.universe.scene.add(line);
    }

  }

  if (typeof exports !== 'undefined') {
    module.exports = Future;
  } else {
    window.gravitator = window.gravitator || {};
    window.gravitator.Future = Future;
  }

}();
