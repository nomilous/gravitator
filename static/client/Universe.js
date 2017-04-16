!function () {

  if (typeof require === 'function') {
    THREE = require('three');
  }

  class Universe {

    constructor(params, scene) {
      this.params = params;
      this.scene = scene;
    }

    set gravitationalConstant(value) {
      this.g = value;
    }

    insertParticle(particle) {
      this['_insert' + particle.type](particle);
    }

    update(time) {
      this.gravitate();
      this.accelerate(time);
      this.move(time);
    }

    gravitate() {
      let i,j;

      for(i = 0; i < this.scene.children.length; i++) {
        let object = this.scene.children[i];
        this._initForce(object);
      }

      for(i = 0; i < this.scene.children.length; i++) {
        for (j = 0; j < i; j++) {
          let forceVector = new THREE.Vector3();
          let object1 = this.scene.children[i];
          let object2 = this.scene.children[j];

          let mass = object1.mass * object2.mass;
          let distance = object1.position.distanceTo(object2.position);
          let force = (this.g * mass) / distance;

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

    accelerate(time) {
      let i;
      for(i = 0; i < this.scene.children.length; i++) {
        let object = this.scene.children[i];

        object.acceleration.x = object.force.x / object.mass;
        object.acceleration.y = object.force.y / object.mass;
        object.acceleration.z = object.force.z / object.mass;

        object.velocity.x += object.acceleration.x * time;
        object.velocity.y += object.acceleration.y * time;
        object.velocity.z += object.acceleration.z * time;
      }
    }

    move(time) {
      this.scene.children.forEach(function (child) {
        child.position.x += child.velocity.x * time;
        child.position.y += child.velocity.y * time;
        child.position.z += child.velocity.z * time;
      });
    }

    _insertSphere(particle) {
      particle.sphere = particle.sphere || {};
      let {radius, widthSegments, heightSegments} = particle.sphere;

      if (!radius) radius = Math.sqrt(particle.mass);
      if (!widthSegments) widthSegments = 9;
      if (!heightSegments) heightSegments = 9;

      let geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
      let object = this._insert(particle, geometry);
    }

    _insert(particle, geometry) {
      let material = new THREE.MeshBasicMaterial({
        color: particle.color || 0x00ff00,
        wireframe: particle.wireframe || false
      });

      let object = new THREE.Mesh(geometry, material);

      this._initMass(object, particle);
      this._initPosition(object, particle);
      this._initVelocity(object, particle);
      this._initForce(object);
      this._initAcceleration(object);

      this.scene.add(object);
    }

    _initMass(object, particle) {
      object.mass = particle.mass || 1;
    }

    _initPosition(object, particle) {
      if (particle.position) {
        object.position.x = particle.position.x || 0;
        object.position.y = particle.position.y || 0;
        object.position.z = particle.position.z || 0;
      }
    }

    _initVelocity(object, particle) {
      object.velocity = {};
      if (particle.velocity) {
        object.velocity.x = particle.velocity.x || 0;
        object.velocity.y = particle.velocity.y || 0;
        object.velocity.z = particle.velocity.z || 0;
      }
    }

    _initForce(object) {
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

    _initAcceleration(object) {
      object.acceleration = {
        x: 0,
        y: 0,
        z: 0
      }
    }

  }

  if (typeof exports !== 'undefined') {
    module.exports = Universe;
  } else {
    window.gravitator = window.gravitator || {};
    window.gravitator.Universe = Universe;
  }

}();
