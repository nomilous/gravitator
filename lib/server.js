const Happner = require('happner-2');
const config = require('../config/server');

Happner.create(config)

  .catch(error => {

    console.error(error);
    process.exit(1);

  });
