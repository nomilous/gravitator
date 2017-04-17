!function () {

  if (typeof require === 'function') {
    THREE = require('three');
    Universe = require('./universe');
  } else {
    Universe = gravitator.Universe;
  }

  class Gravitator {

    constructor(params, aspect) {
      this.params = params;
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
      this._defaults();
      this.universe = new Universe(params, this.scene);
    }

    set aspect(value) {
      this.camera.aspect = value;
      this.camera.updateProjectionMatrix();
    }

    start(api) {
      api.exchange.map.getMap(this.params.map || '1', this.params)
        .then(this._loadMap.bind(this))
        .catch(error => {
          console.error(error);
        })
    }

    update() {
      this.universe.update(this.params.time);
      return {
        scene: this.scene,
        camera: this.camera
      }
    }

    _defaults() {
      this.camera.position.z = 100;
      this.params.time = this.params.time || 1;
      this.params.history = this.params.history || 0;
    }

    _loadMap(map) {
      map.particles = map.particles || [];
      this.universe.gravitationalConstant = map.g || 0.1;
      map.particles.forEach(this.universe.insertParticle.bind(this.universe));
    }

  }

  if (typeof exports !== 'undefined') {
    module.exports = Gravitator;
  } else {
    window.Gravitator = Gravitator;
  }

}();
