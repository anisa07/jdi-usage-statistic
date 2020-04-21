const Result = require('../mongoDb/models/result');
const { Error } = require('../utils/error');

const getResults = () => {
	try {
		return Result.find();
	} catch (e) {
		throw new Error(500, 'Internal server error!');
	}
};

const getSubscribersByDate = ({ today, tomorrow }) => {
	try {
		return Result.find({
			resultDate: {
				$gte: new Date(today),
				$lte: new Date(tomorrow),
			},
		});
	} catch (e) {
		throw new Error(500, 'Internal server error!');
	}
};

const postResults = ({
	uniqueUsers, newUsers, sessions, activeUsers, newProjects, activeProjects, resultDate,
}) => {
	try {
		const addResult = new Result({
			uniqueUsers, newUsers, sessions, activeUsers, newProjects, activeProjects, resultDate,
		});

		return addResult.save();
	} catch (e) {
		throw new Error(500, 'Internal server error!');
	}
};

const deleteAllResults = () => {
	try {
		return Result.deleteMany();
	} catch (e) {
		throw new Error(500, 'Internal server error!');
	}
};

module.exports = {
	postResults,
	getResults,
	deleteAllResults,
	getSubscribersByDate,
};
