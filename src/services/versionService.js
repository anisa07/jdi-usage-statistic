const Version = require('../mongoDb/models/version');

const getVersions = () => Version.find();

const getVersionByDate = (version, date, nextDate) => Version.find({
	version,
	versionDate: {
		$gte: new Date(date),
		$lte: new Date(nextDate),
	},
});

const postVersion = ({ version, date }) => {
	const addVersion = new Version({
		version,
		versionDate: date,
	});
	return addVersion.save();
};

const deleteAllVersions = () => Version.deleteMany();

module.exports = {
	postVersion,
	getVersions,
	getVersionByDate,
	deleteAllVersions,
};
