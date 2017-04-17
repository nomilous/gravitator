!function () {

  if (typeof require === 'function') {
    THREE = require('three');
  }

  class Universe {

    constructor(params, scene) {
      this.params = params;
      this.scene = scene;
      this.objects = [];
    }

    set gravitationalConstant(value) {
      this.g = value;
    }

    insertParticle(particle) {
      this['_insert' + particle.type](particle);
    }

    update(time) {
      this.gravitate(this.objects);
      this.accelerate(this.objects, time);
      this.move(this.objects, time);
      this.history(this.objects);
      this.future(this.objects, time);
    }

    gravitate(objects) {
      let i, j;

      for (i = 0; i < objects.length; i++) {
        let object = objects[i];
        this._initForce(object);
      }

      for (i = 0; i < objects.length; i++) {
        for (j = 0; j < i; j++) {
          let forceVector = new THREE.Vector3();
          let object1 = objects[i];
          let object2 = objects[j];

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

    accelerate(objects, time) {
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

    move(objects, time) {
      objects.forEach(function (object) {
        object.position.x += object.velocity.x * time;
        object.position.y += object.velocity.y * time;
        object.position.z += object.velocity.z * time;
      });
    }

    history(objects) {
      if (!this.params.history) return;

      objects.forEach(object => {
        if (!object.history) return;

        let accum = object.history.accum;
        let positions = object.history.geometry.attributes.position.array;
        let index = 0;
        let i;

        accum.push(object.position.clone());
        while (object.history.accum.length > this.params.history) {
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

    future(objects, time) {
      if (!this.params.future) return;

      this.futureObjects= [];
      objects.forEach(object => {
        let futureObject = {
          object: object
        };
        futureObject.position = object.position.clone();
        this._initMass(futureObject, object);
        this._initVelocity(futureObject, object);
        this._initAcceleration(futureObject, object);
        this.futureObjects.push(futureObject);
      });

      for (let i = 0; i < this.params.future; i++) {
        this.gravitate(this.futureObjects);
        this.accelerate(this.futureObjects, time);
        this.move(this.futureObjects, time);

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

      this.objects.push(object);
      this.scene.add(object);

      this._initHistory(object, particle);
      this._initFuture(object, particle);
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

    _initHistory(object, particle) {
      if (!this.params.history) return;
      if (particle.noHistory) return;

      let material = new THREE.LineBasicMaterial({color: 0x777777, linewidth: 1});
      let geometry = new THREE.BufferGeometry();
      let positions = new Float32Array(this.params.history * 3);

      geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setDrawRange(0, 0);

      let line = new THREE.Line(geometry, material);
      object.history = line;
      object.history.accum = [];
      this.scene.add(line);
    }

    _initFuture(object, particle) {
      if (!this.params.future) return;
      if (particle.noFuture) return;

      let material = new THREE.LineBasicMaterial({color: 0x777777, linewidth: 1});
      let geometry = new THREE.BufferGeometry();
      let positions = new Float32Array(this.params.future * 3);

      geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setDrawRange(0, this.params.future);

      let line = new THREE.Line(geometry, material);
      object.future = line;
      object.future.accum = [];
      this.scene.add(line);
    }

  }

  if (typeof exports !== 'undefined') {
    module.exports = Universe;
  } else {
    window.gravitator = window.gravitator || {};
    window.gravitator.Universe = Universe;
  }

}();
