// const mongoose = require('mongoose');
const Subscriber = require('../mongoDb/models/subscriber');
const Intensity = require('../mongoDb/models/intensity');
const Version = require('../mongoDb/models/version');

// pagination sucks(((
// const foundProducts = await Product.find({name:regex})
//     .skip((resPerPage * page) - resPerPage)
//     .limit(resPerPage);

// GET from DB
const getAllSubscribers = () => Subscriber.find();

const getIntensity = () => Intensity.find();

const getVersions = () => Version.find();

const getIntensityByDate = (date, nextDate) => Intensity.find({
    intensityDate: {
        $gte: new Date(date),
        $lte: new Date(nextDate)
    }
});

const getVersionByDate = (version, date, nextDate) => Version.find({
    version,
    versionDate: {
        $gte: new Date(date),
        $lte: new Date(nextDate)
    }
});

// POST to DB
const postSubscriber = ({userId, projectId, date}) => {
    // return Subscriber.deleteMany();
    const subscriber = new Subscriber({
        subscriberId: userId,
        projectId,
        subscriberDate: date
    });

    return subscriber.save();
    // return Subscriber.findOneAndUpdate({
    //     subscriberId: userId
    // }, {subscriberId: userId, $push: {projectId: projectId, subscriberDate: date}}, {
    //     new: true,
    //     upsert: true,
    //     runValidators: true,
    //     useFindAndModify: false
    // });
};

const postIntensity = ({intensity, intensityDate, today, tomorrow}) => {
    // return Intensity.deleteMany()
    return Intensity.findOneAndUpdate({
        intensityDate: {
            $gte: new Date(today),
            $lte: new Date(tomorrow)
        }
    }, {intensity, intensityDate}, {
        new: true,
        upsert: true,
        runValidators: true,
        useFindAndModify: false
    });
};

const postVersion = ({version, date}) => {
    // return Version.deleteMany();
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
    getAllSubscribers,
    getIntensity,
    getVersions,
    getIntensityByDate,
    getVersionByDate
};
