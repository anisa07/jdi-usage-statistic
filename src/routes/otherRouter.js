const express = require('express');

const router = express.Router();
const {
	getInfo,
	postInfo,
	postIntensity,
} = require('../controllers');

// get all info for home page
router.get('/', async (req, res, next) => {
	try {
		const result = await getInfo(req, res);
		res.end(result);
	} catch (e) {
		next(e);
	}
});

// post subscribers data {date, projectId, userId, version}
router.post('/subscribers', async (req, res, next) => {
	try {
		const result = await postInfo(req, res);
		res.end(result);
	} catch (e) {
		next(e);
	}
});

// post intensity data {intensity}
router.post('/intensity', async (req, res, next) => {
	try {
		const result = await postIntensity(req, res);
		res.end(result);
	} catch (e) {
		next(e);
	}
});

module.exports = router;
