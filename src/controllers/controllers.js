const service = require('../services/index');
const cron = require("node-cron");
const logPromiseError = require('../utils/errorLogger');

const gatherInfo = async () => {
    const subscribers = await service.getAllSubscribers();
    const lastMonth = Date.now() - (3600000*24*30);

    let usersMap = new Map();
    let projectsMap = new Map();
    let uniqueUsers;
    let newUsers = 0;
    let activeUsers = 0;
    let newProjects = 0;
    let activeProjects = 0;
    let sessions = 0;

    subscribers.forEach(subscriber => {
        if (usersMap.has(subscriber.subscriberId)) {
            const user = usersMap.get(subscriber.subscriberId);
            user.dates.push(subscriber.subscriberDate);
        } else {
            usersMap.set(subscriber.subscriberId, {dates: [subscriber.subscriberDate]})
        }

        if (projectsMap.has(subscriber.projectId)) {
            const project = projectsMap.get(subscriber.projectId);
            project.dates.push(subscriber.subscriberDate);
        } else {
            projectsMap.set(subscriber.projectId, {dates: [subscriber.subscriberDate]})
        }

        if (subscriber.subscriberDate > lastMonth) {
            sessions++;
        }
    });

    uniqueUsers = usersMap.size;

    usersMap.forEach((user) => {
        let isActiveUser = false;
        let isOldUser = false;
        const dates = user.dates;

        for (let i=0; i<dates.length; i++){
            if (dates[i] < lastMonth) {
                isOldUser = true;
            }
            if (dates[i] >= lastMonth) {
                isActiveUser = true;
            }
        };

        if (isActiveUser) {
            activeUsers++;
        }
        if (isActiveUser && !isOldUser) {
            newUsers++;
        }
    });

    projectsMap.forEach((project) => {
        let isActiveProject = false;
        let isOldProject = false;
        const dates = project.dates;

        for (let i=0; i<dates.length; i++){
            if (dates[i] < lastMonth) {
                isOldProject = true;
            }
            if (dates[i] >= lastMonth) {
                isActiveProject = true;
            }
        };

        if (isActiveProject && isOldProject) {
            activeProjects++;
        }
        if (isActiveProject && !isOldProject) {
            newProjects++;
        }
    });

    try {
        await service.postResults({
            uniqueUsers,
            newUsers,
            sessions,
            activeUsers,
            newProjects,
            activeProjects,
            resultDate: Date.now()
        });
    } catch (e) {
       logPromiseError(null, 'Error while saving Results of a day to DB');
    }
};

cron.schedule("59 23 * * *", async function() {
    await gatherInfo();
    console.log('Info gathered!');
});

cron.schedule("* * * 12 *", async function() {
    try {
        await service.deleteAllSubscribers();
        console.log('Subscriber info removed!');
    } catch (e) {
        logPromiseError(null, 'Error while clearing Subscribers of a day to DB');
    }
});

const getInfo = async (req, res) => {
    try {
        const today = new Date(Date.now()).setHours(0,0,0);
        const tomorrow = new Date(Date.now()).setHours(23, 59, 59);
        const lastMonth = Date.now() - (3600000*24*30);

        const intensity = await service.getIntensity();
        const versions = await service.getVersions();
        const results = await service.getResults();
        const subscribers = await service.getAllSubscribers();
        const resultsByDate = await service.getSubscribersByDate({today, tomorrow});

        let activeUsedVersions = [];
        let lastMonthUsageIntensity = 0;

        versions.forEach(version => {
            if (version.versionDate > lastMonth){
                activeUsedVersions.push(version.version)
            }
        });

        intensity.forEach(intens => {
            if (intens.intensityDate > lastMonth){
                lastMonthUsageIntensity += intens.intensity;
            }
        });

        const response = {
            results,
            resultsToday: resultsByDate,
            activeUsedVersions,
            lastMonthUsageIntensity
        };

        console.log('intensity', intensity);
        console.log('versions', versions);
        console.log('results', results);
        console.log('subscribers', subscribers);

        res.status(200).json(response);

    } catch (e) {
        console.log(e.message);
        res.status(403).json('Error occurred getting data');
    }
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
