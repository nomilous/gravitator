
function randomFloat(min, max) {
  var span = max - min;
  var random = Math.random() * span;
  return random + min;
}

module.exports = {

  1: function (params) {
    return {
      g: 2,
      particles: [
        {
          type: 'Sphere',
          // sphere: {
          //   // radius: 1,
          //   widthSegments: 9,
          //   heightSegments: 9
          // },
          // wireframe: false,
          color: 0xff0000,
          position: {x: 40, y: 0, z: 0},
          velocity: {x: 0, y: 1, z: 0},
          mass: 1
        },
        {
          type: 'Sphere',
          position: {x: -40, y: 0, z: 0},
          velocity: {x: 0, y: -1, z: 0},
          mass: 1
        }
      ]
    }
  },

  2: function (params) {
    return {
      g: 1,
      particles: [
        {
          type: 'Sphere',
          color: 0xff0000,
          position: {x: 30, y: 0, z: 0},
          velocity: {x: 0, y: 0, z: 0},
          mass: 1
        },
        {
          type: 'Sphere',
          color: 0x00ff00,
          position: {x: -30, y: 0, z: 0},
          velocity: {x: 0, y: 0, z: 0},
          mass: 1
        },
        {
          type: 'Sphere',
          color: 0x0000ff,
          position: {x: 30, y: 30, z: 30},
          velocity: {x: 0, y: 0, z: 0},
          mass: 1
        },
      ]
    }
  },

  3: function (params) {
    return {
      g: 1,
      particles: [
        {
          type: 'Sphere',
          color: 0xfffff55,
          position: {x: 0, y: 0, z: 0},
          velocity: {x: 0, y: 0, z: 0},
          mass: 10
        },
        {
          type: 'Sphere',
          color: 0x1088ff,
          position: {x: 40, y: 40, z: 40},
          velocity: {x: 0, y: 1, z: 0},
          mass: 0.1
        },
        {
          type: 'Sphere',
          color: 0x5493ff,
          position: {x: -40, y: 0, z: -40},
          velocity: {x: 0, y: -1, z: 0},
          mass: 0.4
        },
        {
          type: 'Sphere',
          color: 0x2343ff,
          position: {x: 10, y: 40, z: -10},
          velocity: {x: 0, y: 0.5, z: 1},
          mass: 0.5
        }
      ]
    }
  },

  4: function (params) {
    var particles = [];

    for (var i = 0; i < 300; i++) {
      particles.push({
        type: 'Sphere',
        position: {x: randomFloat(-50, 50), y: randomFloat(-50, 50), z: randomFloat(-50, 50)},
        velocity: {x: randomFloat(-1, 1), y: randomFloat(-1, 1), z: randomFloat(-1, 1)},
        mass: randomFloat(0.01, 0.05)
      });
    }

    return {
      g: 1,
      particles: particles
    }
  }

};
