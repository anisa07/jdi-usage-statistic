const Intensity = require('../mongoDb/models/intensity');

const getIntensity = () => Intensity.find();

const getIntensityByDate = (date, nextDate) => Intensity.find({
	intensityDate: {
		$gte: new Date(date),
		$lte: new Date(nextDate),
	},
});

const postIntensity = ({
	intensity, intensityDate, today, tomorrow,
}) => Intensity.findOneAndUpdate({
	intensityDate: {
		$gte: new Date(today),
		$lte: new Date(tomorrow),
	},
}, { intensity, intensityDate }, {
	new: true,
	upsert: true,
	runValidators: true,
	useFindAndModify: false,
});

const deleteAllIntensity = () => Intensity.deleteMany();

module.exports = {
	postIntensity,
	getIntensity,
	getIntensityByDate,
	deleteAllIntensity,
};
