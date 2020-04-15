const mongoose = require('mongoose');
const { updateIfCurrentPlugin } = require('mongoose-update-if-current');

const resultSchema = new mongoose.Schema({
    uniqueUsers: {
        type: Number,
        required: true,
        default: 0
    },
    newUsers: {
        type: Number,
        required: true,
        default: 0
    },
    sessions: {
        type: Number,
        required: true,
        default: 0
    },
    activeUsers: {
        type: Number,
        required: true,
        default: 0
    },
    newProjects: {
        type: Number,
        required: true,
        default: 0
    },
    activeProjects: {
        type: Number,
        required: true,
        default: 0
    },
    resultDate: {
        type: Date,
        required: true,
        default: Date.now
    }
});

resultSchema.plugin(updateIfCurrentPlugin);

module.exports = mongoose.model('Result', resultSchema);
