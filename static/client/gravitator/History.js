!function () {

  var THREE;

  if (typeof require === 'function') {
    THREE = require('three');
  } else {
    THREE = window.THREE;
  }

  class History {

    constructor(universe) {
      this.universe = universe;
    }

    calculate(objects) {
      if (!this.universe.params.history) return;

      objects.forEach(object => {
        if (!object.history) return;

        let accum = object.history.accum;
        let positions = object.history.geometry.attributes.position.array;
        let index = 0;
        let i;

        accum.push(object.position.clone());
        while (object.history.accum.length > this.universe.params.history) {
          object.history.accum.shift();
        }

        for (i = 0; i < accum.length; i++) {
          let vertex = accum[i];
          positions[index++] = vertex.x;
          positions[index++] = vertex.y;
          positions[index++] = vertex.z;
        }

        object.history.geometry.setDrawRange(0, accum.length);
        object.history.geometry.attributes.position.needsUpdate = true;
      });
    }

    init(object, definition) {
      if (!this.universe.params.history) return;
      if (definition.noHistory) return;

      let material = new THREE.LineBasicMaterial({color: 0x777777, linewidth: 1});
      let geometry = new THREE.BufferGeometry();
      let positions = new Float32Array(this.universe.params.history * 3);

      geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setDrawRange(0, 0);

      let line = new THREE.Line(geometry, material);
      object.history = line;
      object.history.accum = [];
      this.universe.scene.add(line);
    }

  }

  if (typeof exports !== 'undefined') {
    module.exports = History;
  } else {
    window.gravitator = window.gravitator || {};
    window.gravitator.History = History;
  }

}();
