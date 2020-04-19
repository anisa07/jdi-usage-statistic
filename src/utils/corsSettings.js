const whitelist = [
	// 'https://localhost:5000'
];

const corsOptions = {
	origin(origin, callback) {
		if (whitelist.indexOf(origin) !== -1 || !origin) {
			callback(null, true);
		} else {
			callback('Not allowed by CORS');
		}
	},
};

module.exports = {
	corsOptions,
};
