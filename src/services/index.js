let dbServices;

if (process.env.DB === 'mongo') {
    dbServices = require('./mongo');
}

module.exports = dbServices;
