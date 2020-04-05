const mongoose = require('mongoose');
const subscriberSchema = new mongoose.Schema({
    subscriberExternalId: {
        type: String,
        required: true
    },
    // numberOfConnection: {
    //     type: Number,
    //     required: true,
    //     default: 1
    // },
    subscriberDate: {
        type: Date,
        required: true,
        default: Date.now
    }
});

module.exports = mongoose.model('Subscriber', subscriberSchema);
