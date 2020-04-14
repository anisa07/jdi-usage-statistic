const service = require('../services/index');
const logPromiseError = require('../utils/errorLogger');

const getInfo = async (req, res) => {
    const subscribers = await service.getAllSubscribers();
    const intensity = await service.getIntensity();
    const versions = await service.getVersions();

    const lastMonth = Date.now() - (3600000*24*30);
    let uniqueUsers = new Map();
    let newUsers = 0;
    let activeUsers = 0;
    let newProjects = 0;
    let activeProjects = 0;

    let sessionsLastMonth = 0;

    let activeUsedVersions = [];

    let lastMonthUsageIntensity = 0;

    // //subscriberDate, projectId, subscriberId
    subscribers.forEach(subscriber => {
        // let isNewUser = false;
        // let isOldUser = false;

        // for (let i=0; i<dates.length; i++){
        //     if (dates[i] > lastMonth) {
        //         isNewUser = true;
        //     }
        //     if (dates[i] <= lastMonth) {
        //         isOldUser = true;
        //     }
        // }
        //
        // if (isNewUser && isOldUser) {
        //     activeUsers++;
        //     activeProjects++;
        // }
        //
        // if (!isOldUser && isNewUser) {
        //     newUsers++;
        //     newProjects++;
        // }
    });

    // const uniqueUsersSet = new Set();
    // const activeUsersSet = new Set();
    //
    // const subscribersMap = new Map();
    // let sessionsLastMonth = 0;

    // subscribers.forEach(subscriber => {
    //     let sInMap = {};
    //     if (subscribersMap.has(subscriber.subscriberId)) {
    //         sInMap = subscribersMap.get(subscriber.subscriberId);
    //         sInMap.allDates.push(subscriber.subscriberDate);
    //     } else {
    //         const sInMap = {
    //             allDates: [subscriber.subscriberDate],
    //             allProjects: [subscriber.projectId]
    //         };
    //         subscribersMap.set(subscriber.subscriberId, sInMap);
    //     }
    //     if (subscriber.subscriberDate > lastMonth) {
    //         sessionsLastMonth++;
    //     }
    // });
    //
    // // const activeUsers = Array.from(activeUsersSet);
    // const uniqueUsers = subscribersMap.size;

    console.log('subscribers', subscribers);
    console.log('intensity', intensity);
    console.log('versions', versions);
    res.status(200).json('success');
};

// POST data
const resolveErrWhilePost = async (postFunc, params, req) => {
    let attempt = 0;
    let errorType = '';

    while (attempt < 3 && (errorType === 'VersionError' || !errorType)) {
        try {
            attempt++;
            return await postFunc(params);
        } catch (e) {
            logPromiseError(req, e.message);
            errorType = e.type;
        }
    }
};

const saveIntensity = async ({today, tomorrow, date, intensity}) => {
    let intensityArray = await service.getIntensityByDate(today, tomorrow);
    let intensityObj = {
        intensityDate: date,
    };
    if (intensityArray[0]) {
        intensityObj.intensity = intensityArray[0].intensity + intensity;
    } else {
        intensityObj = {
            intensity: intensity,
            intensityDate: date
        }
    }

    await service.postIntensity({...intensityObj, today, tomorrow})
};

const saveVersion = async ({today, tomorrow, date, version}) => {
    const versionsArr = await service.getVersionByDate(version, today, tomorrow);
    if (!versionsArr[0]) {
        await service.postVersion({
            version,
            versionDate: date
        })
    }
};

const postInfo = async (req, res) => {
    const {projectId, userId, version} = req.body;
    const date = Date.now();
    const today = new Date(date).setHours(0,0,0);
    const tomorrow = new Date(date).setHours(23, 59, 59);

    await resolveErrWhilePost(service.postSubscriber, {userId, projectId, date, today, tomorrow}, req);
    await resolveErrWhilePost(saveVersion, {today, tomorrow, date, version}, req);

    res.status(200).json('success');
};

const postIntensity = async (req, res) => {
    const {intensity} = req.body;
    const date = Date.now();
    const today = new Date(date).setHours(0,0,0);
    const tomorrow = new Date(date).setHours(23, 59, 59);

    await resolveErrWhilePost(saveIntensity, {today, tomorrow, date, intensity}, req);

    res.status(200).json('success');
};

module.exports = {
    getInfo,
    postInfo,
    postIntensity
};


//     geAllSubscribers,
//     getIntensityByDate,
//     getVersionByDate
