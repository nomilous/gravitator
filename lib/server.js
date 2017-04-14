const port = process.env.NODE_PORT || 3001;
const address = process.env.NODE_ADDRESS;

const {dirname, sep} = require('path');
const express = require('express');
const app = express();

app.use(express.static(dirname(__dirname) + sep + 'static'));

app.use(express.static(dirname(__dirname) + sep + 'bower_components'));

const server = app.listen(port, address, () => {
  const address = server.address();
  console.log('listening at %s:%s', address.address, address.port);
});

