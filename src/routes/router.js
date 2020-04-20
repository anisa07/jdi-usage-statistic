const express = require('express');

const router = express.Router();
const {
	// getInfo,
	// postInfo,
	// postIntensity,
	userControllers,
	// register,
} = require('../controllers');

// // get all info for home page
// router.get('/info', (req, res) => getInfo(req, res));
//
// // post subscribers data {date, projectId, userId, version}
// router.post('/info', (req, res) => postInfo(req, res));
//
// // post intensity data {intensity}
// router.post('/intensity', (req, res) => postIntensity(req, res));

// post login
router.post('/login', async (req, res, next) => {
	try {
		const result = await userControllers.login(req, res);
		res.end(result);
	} catch (err) {
		next(err);
	}
});

router.delete('/logout', async (req, res, next) => {
	try {
		const result = await userControllers.logout(req, res);
		res.end(result);
	} catch (err) {
		next(err);
	}
});

router.post('/register', async (req, res, next) => {
	try {
		const result = await userControllers.register(req, res);
		res.end(result);
	} catch (err) {
		next(err);
	}
});

router.delete('/delete', async (req, res, next) => {
	try {
		const result = await userControllers.deleteUser(req, res);
		res.end(result);
	} catch (err) {
		next(err);
	}
});

// // get records by id
// router.get('/:externalId', (req, res) => {
//     try {
//         getOneSubscriberById(req, res);
//     } catch (e) {
//         logPromiseError(req, e.message);
//     }
// });
//
// // get records by date
// router.get('/', (req, res) => {
//    try {
//        getSubscribersByDate(req, res);
//    } catch (e) {
//        logPromiseError(req, e.message);
//    }
// });
//
// // post new record
// router.post('/', (req, res) => {
//     try {
//         postSubscriber(req, res);
//     } catch (e) {
//         logPromiseError(req, e.message);
//     }
// });
//
// // DEV purposes only
//
// // delete all records
// router.delete('/', (req, res) => {
//     try {
//         deleteAllSubscribers(req, res);
//     } catch (e) {
//         logPromiseError(req, e.message);
//     }
// });
//
// // delete records by :id
// router.delete('/:externalId', (req, res) => {
//     try {
//         deleteSubscribersById(req, res);
//     } catch (e) {
//         logPromiseError(req, e.message);
//     }
// });

module.exports = router;
