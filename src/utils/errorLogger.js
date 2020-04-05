const bunyan = require('bunyan');

const log = bunyan.createLogger({
    name: 'jdi-statistic-service-error',
});

module.exports = function logPromiseError(request, message) {
    log.error('url:', request.url);
    log.error('method:', request.method);
    log.error('body:', request.body);
    log.error('query:', request._parsedUrl.query);
    log.error('message:', message);
};
