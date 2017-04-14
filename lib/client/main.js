const THREE = require('three');

module.exports = function (scene, camera, renderer) {

  const geometry = new THREE.SphereGeometry(1, 10, 10);
  const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true
  });
  const cube = new THREE.Mesh(geometry, material);

  scene.add(cube);

  camera.position.z = 4;

};
