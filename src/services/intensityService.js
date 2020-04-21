const Intensity = require('../mongoDb/models/intensity');
const { Error } = require('../utils/error');

const getIntensity = () => {
	try {
		return Intensity.find();
	} catch (e) {
		throw new Error(500, 'Internal server error!');
	}
};

const getIntensityByDate = (date, nextDate) => {
	try {
		return Intensity.find({
			intensityDate: {
				$gte: new Date(date),
				$lte: new Date(nextDate),
			},
		});
	} catch (e) {
		throw new Error(500, 'Internal server error!');
	}
};

const postIntensity = ({
	intensity, intensityDate, today, tomorrow,
}) => {
	try {
		return Intensity.findOneAndUpdate({
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
	} catch (e) {
		throw new Error(500, 'Internal server error!');
	}
};

const deleteAllIntensity = () => {
	try {
		return Intensity.deleteMany();
	} catch (e) {
		throw new Error(500, 'Internal server error!');
	}
};

module.exports = {
	postIntensity,
	getIntensity,
	getIntensityByDate,
	deleteAllIntensity,
};
