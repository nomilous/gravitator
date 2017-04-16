module.exports = {

  1: function () {
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
  }

};
