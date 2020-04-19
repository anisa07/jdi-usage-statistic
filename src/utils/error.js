const logError = require('./errorLogger');

class ErrorHandler extends Error {
	constructor(statusCode, message) {
		super();
		this.statusCode = statusCode;
		this.message = message;
	}
}

const handleError = (err, res) => {
	const { statusCode, message } = err;
	logError(null, message);
	res.status(statusCode).json({
		status: 'error',
		statusCode,
		message,
	});
};

module.exports = {
	Error: ErrorHandler,
	handleError,
};
