const mongoose = require('mongoose');
const { updateIfCurrentPlugin } = require('mongoose-update-if-current');

const intensitySchema = new mongoose.Schema({
	intensity: {
		type: Number,
		required: true,
	},
	intensityDate: {
		type: Date,
		required: true,
		default: Date.now,
	},
});

intensitySchema.plugin(updateIfCurrentPlugin);

module.exports = mongoose.model('Intensity', intensitySchema);
