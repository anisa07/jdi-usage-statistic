const Result = require('../mongoDb/models/result');

const getResults = () => Result.find();

const postResults = ({
	uniqueUsers, newUsers, sessions, activeUsers, newProjects, activeProjects, resultDate,
}) => {
	const addResult = new Result({
		uniqueUsers, newUsers, sessions, activeUsers, newProjects, activeProjects, resultDate,
	});

	return addResult.save();
};

const deleteAllResults = () => Result.deleteMany();

module.exports = {
	postResults, getResults, deleteAllResults,
};
