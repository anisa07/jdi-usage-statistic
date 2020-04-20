const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	user: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	token: {
		type: mongoose.Schema.Types.Mixed,
	},
});

module.exports = mongoose.model('User', userSchema);
