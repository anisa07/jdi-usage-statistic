const mongoose = require('mongoose');
const { updateIfCurrentPlugin } = require('mongoose-update-if-current');

const versionSchema = new mongoose.Schema({
	version: {
		type: String,
		required: true,
	},
	versionDate: {
		type: Date,
		required: true,
		default: Date.now,
	},
});

versionSchema.plugin(updateIfCurrentPlugin);

module.exports = mongoose.model('Version', versionSchema);
