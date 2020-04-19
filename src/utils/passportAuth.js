const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy;
const User = require('../mongoDb/models/user');
const { Error } = require('./error');

passport.use(new BearerStrategy(((token, done) => {
	User.findOne({ token }, (err, user) => {
		if (err) {
			return done(
				new Error(500, 'Internal server error'),
			);
		}
		if (!user) {
			return done(null, false);
		}
		return done(null, user, { scope: 'all' });
	});
})));

module.exports = passport.authenticate('bearer', { session: false });
