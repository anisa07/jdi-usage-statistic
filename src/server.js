const express = require('express');
const cors = require('cors');
const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy;
const fs = require('fs');
const path = require('path');
const https = require('https');
const User = require('./mongoDb/models/user');
const { handleError } = require('./utils/error');
const { corsOptions } = require('./utils/corsSettings');

require('dotenv').config();
require('./mongoDb/mongoConnection');

const router = require('./routes/router');

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

passport.use(new BearerStrategy(((token, done) => {
	User.findOne({ token }, (err, user) => {
		if (err) {
			return done(err);
		}
		if (!user) {
			return done(null, false);
		}
		return done(null, user, { scope: 'all' });
	});
})));

app.use('/jdi/usage/statistic', passport.authenticate('bearer', { session: false }), router);
app.use('/jdi', router);
// app.get('/error', (req, res) => {
// 	throw new Error(500, 'Internal server error');
// });
// app.use('/statistic', express.static(__dirname + '/public'));
app.use((err, req, res, next) => {
	handleError(err, res);
	next();
});

https.createServer({
	key: fs.readFileSync(path.join('.', '/keys/', 'server.key')),
	cert: fs.readFileSync(path.join('.', '/keys/', 'server.cert')),
}, app).listen(process.env.SERVER_PORT || 4000, () => {
	console.log(`App listening on port ${process.env.SERVER_PORT}`);
});
