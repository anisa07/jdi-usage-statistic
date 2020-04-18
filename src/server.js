const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const https = require('https');
const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy;
const User = require('./mongoDb/models/user');

require('dotenv').config();

const router = require('./routes/router');
const app = express();

const whitelist = [
	// 'https://localhost:5000'
];
const corsOptions = {
	origin: function (origin, callback) {
		if (whitelist.indexOf(origin) !== -1 || !origin) {
			callback(null, true)
		} else {
			callback('Not allowed by CORS')
		}
	}
};

let db;

if (process.env.DB === 'mongo') {
	db = require('./mongoDb/mongoConnection');
}

app.use(cors(corsOptions));
app.use(express.json());

// function customCallback(req, res, next) {
//     passport.authenticate('bearer', options, function (error, user, info) {
//         if (error) {
//             return next(error);
//         }
//
//         if (!user) {
//             // info containing default error messages or your defined ones.
//
//             next(info);
//         } else {
//             // do something with `info`
//
//             next();
//         }
//     })(req, res, next);
// }
//

passport.use(new BearerStrategy(function (token, done) {
			User.findOne({token}, function (err, user) {
				if (err) {
					return done(err);
				}
				if (!user) {
					return done(null, false);
				}
				return done(null, user, {scope: 'all'});
			});
		}
		// try {
		//     const { username } = jwt.decode(token, SECRET);
		//     if (username === ADMIN) {
		//         done(null, username);
		//         return;
		//     }
		//     done(null, false);
		// } catch (error) {
		//     done(null, false);
		// }
));

app.use('/jdi/usage/statistic', passport.authenticate('bearer', {session: false}), router);
app.use('/jdi', router);
// app.use('/statistic', express.static(__dirname + '/public'));

https.createServer({
	key: fs.readFileSync(path.join('.', '/keys/', 'server.key')),
	cert: fs.readFileSync(path.join('.', '/keys/', 'server.cert'))
}, app)
		.listen(process.env.SERVER_PORT || 5000, function () {
			console.log('App listening on port ' + process.env.SERVER_PORT)
		});
