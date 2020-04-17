const express = require('express');
const fs = require('fs');
const path = require('path');
const https = require('https');
require('dotenv').config();
const router = require('./routes/router');

const app = express();

let db;

if (process.env.DB === 'mongo') {
    db = require('./mongoDb/mongoConnection');
}

app.use(express.json());
app.use('/jdi/usage/statistic', router);
// app.use('/statistic', express.static(__dirname + '/public'));


https.createServer({
    key: fs.readFileSync(path.join('.','/keys/', 'server.key')),
    cert: fs.readFileSync(path.join('.','/keys/', 'server.cert'))
}, app)
    .listen(process.env.SERVER_PORT || 5000, function () {
        console.log('App listening on port '+ process.env.SERVER_PORT)
    });
