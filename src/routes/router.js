const express = require('express');
const router = express.Router();
const {
    getInfo,
    postInfo
} = require('../controllers/controllers');

// get all info for home page
router.get('/info', (req, res) => getInfo(req, res));

// post subscribers data {date, projectId, userId, version}
router.post('/info', (req, res) => postInfo(req, res));

// post intensity data {intensity}
router.post('/intensity', (req, res) => postIntensity(req, res));

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
