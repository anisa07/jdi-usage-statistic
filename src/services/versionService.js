const Version = require('../mongoDb/models/version');
const { Error } = require('../utils/error');

const getVersions = () => {
	try {
		return Version.find();
	} catch (e) {
		throw new Error(500, 'Internal server error!');
	}
};

const getVersionByDate = (version, date, nextDate) => {
	try {
		return Version.find({
			version,
			versionDate: {
				$gte: new Date(date),
				$lte: new Date(nextDate),
			},
		});
	} catch (e) {
		throw new Error(500, 'Internal server error!');
	}
};

const postVersion = ({ version, date }) => {
	try {
		const addVersion = new Version({
			version,
			versionDate: date,
		});
		return addVersion.save();
	} catch (e) {
		throw new Error(500, 'Internal server error!');
	}
};

const deleteAllVersions = () => {
	try {
		return Version.deleteMany();
	} catch (e) {
		throw new Error(500, 'Internal server error!');
	}
};

module.exports = {
	postVersion,
	getVersions,
	getVersionByDate,
	deleteAllVersions,
};
