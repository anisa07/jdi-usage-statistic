const mongoose = require('mongoose');
// require('dotenv').config();

mongoose.connect(process.env.DATABASE_MONGO_URL, { useNewUrlParser: true,  useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('connected to mongo database'));

module.exports = db;
