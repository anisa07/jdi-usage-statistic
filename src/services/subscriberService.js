const Subscriber = require('../mongoDb/models/subscriber');

const getAllSubscribers = () => Subscriber.find();

const postSubscriber = ({ userId, projectId, date }) => {
	const subscriber = new Subscriber({
		subscriberId: userId,
		projectId,
		subscriberDate: date,
	});
	return subscriber.save();
};

const deleteAllSubscribers = () => Subscriber.deleteMany();

module.exports = {
	postSubscriber,
	getAllSubscribers,
	deleteAllSubscribers,
};
