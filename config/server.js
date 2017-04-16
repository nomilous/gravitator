const port = process.env.NODE_PORT || 3001;
const host = process.env.NODE_HOST;

const serveStatic = require('serve-static');
const {dirname, sep} = require('path');
const modulesDir = dirname(__dirname) + sep + 'lib' + sep + 'modules' + sep;

module.exports = {

  happn: {
    host: host,
    port: port
  },

  web: {
    routes: {
      '/': serveStatic(dirname(__dirname) + sep + 'static')
    }
  },

  modules: {
    'map': {
      path: modulesDir + 'map'
    }
  },

  components: {
    'map': {}
  }

};
