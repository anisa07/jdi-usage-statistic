const service = require('../services/index');
const logPromiseError = require('../utils/errorLogger');

const getInfo = async (req, res) => {

};

// POST data
const resolveErrWhilePost = async (postFunc, params, req) => {
    let attempt = 0;
    let errorType = '';

    while (attempt < 3 && (errorType === 'VersionError' || !errorType)) {
        try {
            attempt++;
            await postFunc(params);
        } catch (e) {
            logPromiseError(req, e.message);
            errorType = e.type;
        }
    }
};

const saveIntensity = async ({today, tomorrow, date}) => {
    let intensityObj = await service.getIntensityByDate(today, tomorrow);
    if (intensityObj) {
        intensityObj.intensity += 1;
    } else {
        intensityObj = {
            intensity: 1,
            intensityDate: date
        }
    }
    await service.postIntensity(intensityObj)
};

const saveVersion = async ({today, tomorrow, date, version}) => {
    const versionObj = await service.getVersionByDate(version, today, tomorrow);
    if (!versionObj) {
        await service.postVersion({
            version,
            versionDate: date
        })
    }
};

const postInfo = async (req, res) => {
    const {date, projectId, userId, version} = req.body;
    const today = new Date(date).setHours(0,0,0);
    const tomorrow = new Date(date).setHours(23, 59, 59);

    await resolveErrWhilePost(service.postSubscriber, {userId, projectId, date}, req);
    await resolveErrWhilePost(saveIntensity, {today, tomorrow, date}, req);
    await resolveErrWhilePost(saveVersion, {today, tomorrow, date, version}, req);
};

module.exports = {
    getInfo,
    postInfo
};


//     geAllSubscribers,
//     getIntensityByDate,
//     getVersionByDate
