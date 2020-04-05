const express = require('express');
const router = express.Router();
const logPromiseError = require('../utils/errorLogger');
const {
    getAllSubscribers,
    postSubscriber,
    getOneSubscriberById,
    getSubscribersByDate,
    deleteSubscribersById,
    deleteAllSubscribers
} = require('../controllers/controllers');

// get all records
router.get('/', (req, res) => {
    try {
        getAllSubscribers(req, res);
    } catch (e) {
        logPromiseError(req, e.message);
    }
});

// get records by id
router.get('/:externalId', (req, res) => {
    try {
        getOneSubscriberById(req, res);
    } catch (e) {
        logPromiseError(req, e.message);
    }
});

// get records by date
router.get('/', (req, res) => {
   try {
       getSubscribersByDate(req, res);
   } catch (e) {
       logPromiseError(req, e.message);
   }
});

// post new record
router.post('/', (req, res) => {
    try {
        postSubscriber(req, res);
    } catch (e) {
        logPromiseError(req, e.message);
    }
});

// delete all records
router.delete('/', (req, res) => {
    try {
        deleteAllSubscribers(req, res);
    } catch (e) {
        logPromiseError(req, e.message);
    }
});

// delete records by :id
router.delete('/:externalId', (req, res) => {
    try {
        deleteSubscribersById(req, res);
    } catch (e) {
        logPromiseError(req, e.message);
    }
});

module.exports = router;
