const bunyan = require('bunyan');

const log = bunyan.createLogger({
	name: 'jdi-statistic-service-error',
});

module.exports = function logError(request, message) {
	if (request) {
		log.error('url:', request.url);
		log.error('method:', request.method);
	}
	log.error('Error message:', message);
};
