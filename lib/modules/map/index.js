module.exports = Map;

function Map() {
};

Map.prototype.getMap = function (mapId, params, callback) {

  var maps;

  if (process.env.NODE_ENV != 'production') {
    delete require.cache[require.resolve('./maps')];
  }

  maps = require('./maps');

  if (!maps[mapId]) return callback(new Error('no such map'));
  callback(null, maps[mapId](params));
};
