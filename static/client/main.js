!function () {

  const renderer = new THREE.WebGLRenderer();
  const aspect = window.innerWidth / window.innerHeight;
  const client = new Happner.HappnerClient();
  const params = getParams();
  const gravitator = new Gravitator(params, aspect);

  const api = client.construct({
    map: {
      version: '^1.0.0',
      methods: {
        getMap: {}
      }
    }
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  function onWindowResize() {
    gravitator.aspect = window.innerWidth / window.innerHeight;
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  window.addEventListener('resize', onWindowResize, false);

  function render() {
    let {scene, camera} = gravitator.update();
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }

  render();

  client.connect({
    host: location.hostname,
    port: location.port
  },{
    host: location.hostname,
    port: location.port
  })
    .then(() => {
      gravitator.start(api);
    })
    .catch(error => {
      console.error(error);
    });

  function getParams() {
    let params = {};

    if (document.URL.indexOf('?') > 0) {
      document.URL.split('?')
        .pop()
        .split('&')
        .forEach(function (param) {
          let [key, value] = param.split('=')
          params[decodeURI(key)] = decodeURI(value);
        });
    }

    return params;
  }

}();
