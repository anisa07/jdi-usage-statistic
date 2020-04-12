let service;

if (process.env.DB === 'mongo') {
    service = require('./service');
}

module.exports = service;
