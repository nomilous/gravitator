!function () {

  var THREE;
  var Existence;
  var Gravitation;
  var Acceleration;
  var Motion;
  var History;
  var Future;

  if (typeof require === 'function') {
    THREE = require('three');
    Existence = require('./Existence');
    Gravitation = require('./Gravitation');
    Acceleration = require('./Acceleration');
    Motion = require('./Motion');
    History = require('./History');
    Future = require('./Future');
  } else {
    THREE = window.THREE;
    Existence = window.gravitator.Existence;
    Gravitation = window.gravitator.Gravitation;
    Acceleration = window.gravitator.Acceleration;
    Motion = window.gravitator.Motion;
    History = window.gravitator.History;
    Future = window.gravitator.Future;
  }

  class Universe {

    constructor(params, scene) {
      this.params = params;
      this.scene = scene;
      this.objects = [];
      this.existence = new Existence(this);
      this.gravitation = new Gravitation(this);
      this.acceleration = new Acceleration(this);
      this.motion = new Motion(this);
      this.history = new History(this);
      this.future = new Future(this);
    }

    set gravitationalConstant(value) {
      this.g = value;
    }

    insertObject(definition) {
      this['_insert' + definition.type](definition);
    }

    update(time) {
      this.gravitation.calculate(this.objects);
      this.acceleration.calculate(this.objects, time);
      this.motion.calculate(this.objects, time);
      this.history.calculate(this.objects);
      this.future.calculate(this.objects, time);
    }

    _insertSphere(definition) {
      definition.sphere = definition.sphere || {};
      let {radius, widthSegments, heightSegments} = definition.sphere;

      if (!radius) radius = Math.sqrt(definition.mass);
      if (!widthSegments) widthSegments = 9;
      if (!heightSegments) heightSegments = 9;

      let geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
      let object = this._insert(definition, geometry);
    }

    _insert(definition, geometry) {
      let material = new THREE.MeshBasicMaterial({
        color: definition.color || 0x00ff00,
        wireframe: definition.wireframe || false
      });

      let object = new THREE.Mesh(geometry, material);

      this.existence.init(object, definition);
      this.motion.init(object, definition);
      this.gravitation.init(object);
      this.acceleration.init(object, definition);

      this.objects.push(object);
      this.scene.add(object);

      this.history.init(object, definition);
      this.future.init(object, definition);
    }

  }

  if (typeof exports !== 'undefined') {
    module.exports = Universe;
  } else {
    window.gravitator = window.gravitator || {};
    window.gravitator.Universe = Universe;
  }

}();
