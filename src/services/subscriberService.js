const Subscriber = require('../mongoDb/models/subscriber');
const { Error } = require('../utils/error');

const getAllSubscribers = () => {
	try {
		return Subscriber.find();
	} catch (e) {
		throw new Error(500, 'Internal server error!');
	}
};

const postSubscriber = ({ userId, projectId, date }) => {
	try {
		const subscriber = new Subscriber({
			subscriberId: userId,
			projectId,
			subscriberDate: date,
		});
		return subscriber.save();
	} catch (e) {
		throw new Error(500, 'Internal server error!');
	}
};

const deleteAllSubscribers = () => {
	try {
		return Subscriber.deleteMany();
	} catch (e) {
		throw new Error(500, 'Internal server error!');
	}
};

module.exports = {
	postSubscriber,
	getAllSubscribers,
	deleteAllSubscribers,
};
