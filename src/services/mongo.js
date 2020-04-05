const Subscriber = require('../mongoDb/models/subscriber');

const getAll = () => Subscriber.find();

// const foundProducts = await Product.find({name:regex})
//     .skip((resPerPage * page) - resPerPage)
//     .limit(resPerPage);

const postSubscriber = ({externalId}) => {
    const subscriber = new Subscriber({
        subscriberExternalId: externalId,
        // numberOfConnection: count
    });

    return subscriber.save();
};

const getSubscriberById = ({externalId}) => Subscriber.find({subscriberExternalId: externalId});

const getSubscribersByDate = ({date}) => Subscriber.find({subscriberDate: date});

const deleteSubscriberById = ({externalId}) => Subscriber.remove({subscriberExternalId: externalId});

const deleteAllSubscribers = () => Subscriber.remove();

module.exports = {
    getAll,
    postSubscriber,
    getSubscriberById,
    getSubscribersByDate,
    deleteSubscriberById,
    deleteAllSubscribers
};
