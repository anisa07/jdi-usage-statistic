const cron = require('node-cron');
const {
	resultsService,
	intensityService,
	subscriberService,
	versionService,
} = require('../services');
const logPromiseError = require('../utils/errorLogger');
const { Error } = require('../utils/error');

const { SEND_KEY } = process.env;

const resolveErrWhilePost = async (postFunc, params, req) => {
	let attempt = 0;
	let errorType = '';

	while (attempt < 3 && (errorType === 'VersionError' || !errorType)) {
		try {
			attempt += 1;
			// eslint-disable-next-line no-await-in-loop
			return await postFunc(params);
		} catch (e) {
			logPromiseError(req, e.message);
			errorType = e.type;
		}
	}
};

const saveVersion = async ({
	today, tomorrow, date, version,
}) => {
	const versionsArr = await versionService.getVersionByDate(version, today, tomorrow);
	if (!versionsArr[0]) {
		await versionService.postVersion({
			version,
			versionDate: date,
		});
	}
};

const saveIntensity = async ({
	today, tomorrow, date, intensity,
}) => {
	const intensityArray = await intensityService.getIntensityByDate(today, tomorrow);
	let intensityObj = {
		intensityDate: date,
	};
	if (intensityArray[0]) {
		intensityObj.intensity = intensityArray[0].intensity + intensity;
	} else {
		intensityObj = {
			intensity,
			intensityDate: date,
		};
	}

	await intensityService.postIntensity({ ...intensityObj, today, tomorrow });
};

const gatherInfo = async () => {
	const subscribers = await subscriberService.getAllSubscribers();
	const lastMonth = Date.now() - (3600000 * 24 * 30);

	const usersMap = new Map();
	const projectsMap = new Map();
	let newUsers = 0;
	let activeUsers = 0;
	let newProjects = 0;
	let activeProjects = 0;
	let sessions = 0;

	subscribers.forEach((subscriber) => {
		if (usersMap.has(subscriber.subscriberId)) {
			const user = usersMap.get(subscriber.subscriberId);
			user.dates.push(subscriber.subscriberDate);
		} else {
			usersMap.set(subscriber.subscriberId, { dates: [subscriber.subscriberDate] });
		}

		if (projectsMap.has(subscriber.projectId)) {
			const project = projectsMap.get(subscriber.projectId);
			project.dates.push(subscriber.subscriberDate);
		} else {
			projectsMap.set(subscriber.projectId, { dates: [subscriber.subscriberDate] });
		}

		if (subscriber.subscriberDate > lastMonth) {
			sessions += 1;
		}
	});

	const uniqueUsers = usersMap.size;

	usersMap.forEach((user) => {
		let isActiveUser = false;
		let isOldUser = false;
		const { dates } = user;

		for (let i = 0; i < dates.length; i++) {
			if (dates[i] < lastMonth) {
				isOldUser = true;
			}
			if (dates[i] >= lastMonth) {
				isActiveUser = true;
			}
		}

		if (isActiveUser) {
			activeUsers += 1;
		}
		if (isActiveUser && !isOldUser) {
			newUsers += 1;
		}
	});

	projectsMap.forEach((project) => {
		let isActiveProject = false;
		let isOldProject = false;
		const { dates } = project;

		for (let i = 0; i < dates.length; i++) {
			if (dates[i] < lastMonth) {
				isOldProject = true;
			}
			if (dates[i] >= lastMonth) {
				isActiveProject = true;
			}
		}

		if (isActiveProject) {
			activeProjects += 1;
		}
		if (isActiveProject && !isOldProject) {
			newProjects += 1;
		}
	});

	await resultsService.postResults({
		uniqueUsers,
		newUsers,
		sessions,
		activeUsers,
		newProjects,
		activeProjects,
		resultDate: Date.now(),
	});
};

cron.schedule('59 23 * * *', async () => {
	await gatherInfo();
	console.log('Info gathered!');
});

cron.schedule('* * * 12 *', async () => {
	await subscriberService.deleteAllSubscribers();
	console.log('Subscriber info removed!');
});

const getInfo = async (req, res) => {
	const lastMonth = Date.now() - (3600000 * 24 * 30);

	const intensity = await intensityService.getIntensity();
	const versions = await versionService.getVersions();
	const results = await resultsService.getResults();
	// const subscribers = await subscriberService.getAllSubscribers();

	const activeUsedVersions = [];
	let lastMonthUsageIntensity = 0;

	versions.forEach((version) => {
		if (version.versionDate > lastMonth) {
			activeUsedVersions.push(version.version);
		}
	});

	intensity.forEach((intens) => {
		if (intens.intensityDate > lastMonth) {
			lastMonthUsageIntensity += intens.intensity;
		}
	});

	const response = {
		results,
		activeUsedVersions,
		lastMonthUsageIntensity,
	};

	// console.log('intensity', intensity);
	// console.log('versions', versions);
	// console.log('results', results);
	// console.log('subscribers', subscribers);

	res.status(200).json(response);
};

const postInfo = async (req, res) => {
	const {
		projectId, userId, version, key,
	} = req.body;
	const date = Date.now();
	const today = new Date(date).setHours(0, 0, 0);
	const tomorrow = new Date(date).setHours(23, 59, 59);

	if (key !== SEND_KEY) {
		throw new Error(401, 'Data key is not correct!');
	}

	if (!projectId || !userId || !version) {
		throw new Error(400, 'Send data is not correct!');
	}

	await resolveErrWhilePost(subscriberService.postSubscriber, {
		userId, projectId, date, today, tomorrow,
	}, req);

	await resolveErrWhilePost(saveVersion, {
		today, tomorrow, date, version,
	}, req);

	res.status(200).json({
		userId,
		projectId,
		version,
		date,
	});
};

const postIntensity = async (req, res) => {
	const { intensity, key } = req.body;
	const date = Date.now();
	const today = new Date(date).setHours(0, 0, 0);
	const tomorrow = new Date(date).setHours(23, 59, 59);

	if (key !== SEND_KEY) {
		throw new Error(401, 'Data key is not correct!');
	}

	await resolveErrWhilePost(saveIntensity, {
		today, tomorrow, date, intensity,
	}, req);

	res.status(200).json({
		intensity,
		date,
	});
};

module.exports = {
	getInfo,
	postInfo,
	postIntensity,
};
