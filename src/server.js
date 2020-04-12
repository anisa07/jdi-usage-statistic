const express = require('express');
require('dotenv').config();
const router = require('./routes/router');

const app = express();

let db;

if (process.env.DB === 'mongo') {
    db = require('./mongoDb/mongoConnection');
}

app.use(express.json());
app.use('/jdi/usage/statistic', router);
app.use('/statistic', express.static(__dirname + '/public'));

app.listen(process.env.SERVER_PORT || 5000, () => console.log('server started on port ' + process.env.SERVER_PORT));
