const service = require('../services/index');
const logPromiseError = require('../utils/errorLogger');

const getInfo = async (req, res) => {
    const subscribers = await service.getAllSubscribers();
    const intensity = await service.getIntensity();
    const versions = await service.getVersions();

    const uniqueUsers = new Set(subscribers.map(user => user.subscriberId));

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

const saveIntensity = async ({today, tomorrow, date}) => {
    let intensityArray = await service.getIntensityByDate(today, tomorrow);
    let intensityObj = {
        intensityDate: date,
    };
    if (intensityArray[0]) {
        intensityObj.intensity = intensityArray[0].intensity + 1;
    } else {
        intensityObj = {
            intensity: 1,
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

    await resolveErrWhilePost(service.postSubscriber, {userId, projectId, date}, req);
    await resolveErrWhilePost(saveIntensity, {today, tomorrow, date}, req);
    await resolveErrWhilePost(saveVersion, {today, tomorrow, date, version}, req);

    res.status(200).json('success');
};

module.exports = {
    getInfo,
    postInfo
};


//     geAllSubscribers,
//     getIntensityByDate,
//     getVersionByDate
