// const mongoose = require('mongoose');
const Subscriber = require('../mongoDb/models/subscriber');
const Intensity = require('../mongoDb/models/intensity');
const Version = require('../mongoDb/models/version');

// pagination sucks(((
// const foundProducts = await Product.find({name:regex})
//     .skip((resPerPage * page) - resPerPage)
//     .limit(resPerPage);

// GET from DB
const geAllSubscribers = () => Subscriber.find();

const getIntensityByDate = (date, nextDate) => Intensity.find({
    intensityDate: {
        '$gte': date,
        '$lt': nextDate
    }
});

const getVersionByDate = (version, date, nextDate) => Version.find({
    version,
    versionDate: {
        '$gte': date,
        '$lt': nextDate
    }
});

// POST to DB
const postSubscriber = ({userId, projectId, date}) => {
    const subscriber = new Subscriber({
        subscriberId: userId,
        projectId,
        subscriberDate: date
    });

    return subscriber.save();
};

const postIntensity = ({intensity, date}) => {
    const addIntensity = new Intensity({
        intensity,
        intensityDate: date
    });

    return addIntensity.save();
};
// Intensity.findOneAndUpdate({intensityDate: date}, {intensity}, {
//     new: true,
//     upsert: true,
//     runValidators: true
// });

const postVersion = ({version, date}) => {
    const addVersion = new Version({
        version,
        versionDate: date
    });

    return addVersion.save()
};


// const getSubscriberById = ({externalId}) => Subscriber.find({subscriberExternalId: externalId});
//
// const getSubscribersByDate = ({date}) => Subscriber.find({subscriberDate: date});
//
// const deleteSubscriberById = ({externalId}) => Subscriber.remove({subscriberExternalId: externalId});
//
// const deleteAllSubscribers = () => Subscriber.remove();

module.exports = {
    postSubscriber,
    postIntensity,
    postVersion,
    geAllSubscribers,
    getIntensityByDate,
    getVersionByDate
};
