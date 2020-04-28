const whitelist = [
	'https://localhost:4999',
	'http://localhost:9000',
];

const corsOptions = {
	origin(origin, callback) {
		if (whitelist.indexOf(origin) !== -1 || !origin) {
			callback(null, true);
		} else {
			callback({ error: 'Not allowed by CORS', statusCode: 429 });
		}
	},
};

module.exports = {
	corsOptions,
};
