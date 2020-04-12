const mongoose = require('mongoose');
const { updateIfCurrentPlugin } = require('mongoose-update-if-current');

const subscriberSchema = new mongoose.Schema({
    subscriberId: {
        type: String,
        required: true
    },
    projectId: {
        type: String,
        required: true
    },
    subscriberDate: {
        type: Date,
        required: true,
        default: Date.now
    }
});

subscriberSchema.plugin(updateIfCurrentPlugin);

module.exports = mongoose.model('Subscriber', subscriberSchema);
