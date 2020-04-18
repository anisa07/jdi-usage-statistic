const Subscriber = require('../mongoDb/models/subscriber');
const Intensity = require('../mongoDb/models/intensity');
const Version = require('../mongoDb/models/version');
const Result = require('../mongoDb/models/result');
const User = require('../mongoDb/models/user');

// pagination sucks(((
// const foundProducts = await Product.find({name:regex})
//     .skip((resPerPage * page) - resPerPage)
//     .limit(resPerPage);

// GET from DB
const getAllSubscribers = () => Subscriber.find();

const getIntensity = () => Intensity.find();

const getVersions = () => Version.find();

const getIntensityByDate = (date, nextDate) => Intensity.find({
	intensityDate: {
		$gte: new Date(date),
		$lte: new Date(nextDate)
	}
});

const getVersionByDate = (version, date, nextDate) => Version.find({
	version,
	versionDate: {
		$gte: new Date(date),
		$lte: new Date(nextDate)
	}
});

const getResults = () => Result.find();
// const getResults = () => Result.deleteMany();

const getSubscribersByDate = ({today, tomorrow}) => Result.find({
	resultDate: {
		$gte: new Date(today),
		$lte: new Date(tomorrow)
	}
});

const postUser = ({user, token}) => {
	const newUser = new User({
		user,
		token,
	});

	return newUser.save();
};

const getUser = (token, done) => User.findOne({token}, function (err, user) {
	if (err) {
		return done(err);
	}
	if (!user) {
		return done(null, false);
	}
	return done(null, user, {scope: 'all'});
});

const getUserByName = (user) => User.findOne({user});

// POST to DB
const postSubscriber = ({userId, projectId, date}) => {
	// return Subscriber.deleteMany();
	const subscriber = new Subscriber({
		subscriberId: userId,
		projectId,
		subscriberDate: date
	});

	return subscriber.save();
};

const postIntensity = ({intensity, intensityDate, today, tomorrow}) => {
	// return Intensity.deleteMany()
	return Intensity.findOneAndUpdate({
		intensityDate: {
			$gte: new Date(today),
			$lte: new Date(tomorrow)
		}
	}, {intensity, intensityDate}, {
		new: true,
		upsert: true,
		runValidators: true,
		useFindAndModify: false
	});
};

const postVersion = ({version, date}) => {
	// return Version.deleteMany();
	const addVersion = new Version({
		version,
		versionDate: date
	});

	return addVersion.save()
};

const postResults = ({uniqueUsers, newUsers, sessions, activeUsers, newProjects, activeProjects, resultDate}) => {
	const addResult = new Result({
		uniqueUsers,
		newUsers,
		sessions,
		activeUsers,
		newProjects,
		activeProjects,
		resultDate
	});

	return addResult.save();
};

const deleteAllSubscribers = () => Subscriber.deleteMany();

module.exports = {
	postSubscriber,
	postIntensity,
	postVersion,
	postResults,
	postUser,
	getAllSubscribers,
	getIntensity,
	getVersions,
	getIntensityByDate,
	getVersionByDate,
	getResults,
	getSubscribersByDate,
	getUser,
	getUserByName,
	deleteAllSubscribers
};
