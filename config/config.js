var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'iotws-server'
    },
    port: process.env.PORT || 3001,
    db: 'mongodb://localhost/iotws-server-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'iotws-server'
    },
    port: process.env.PORT || 3002,
    db: 'mongodb://localhost/iotws-server-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'iotws-server'
    },
    port: process.env.PORT || 3123,
    db: 'mongodb://localhost/iotws-server-production'
  }
};

module.exports = config[env];
