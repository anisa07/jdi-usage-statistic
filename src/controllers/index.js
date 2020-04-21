const userControllers = require('./userControllers');
const {
	getInfo,
	postInfo,
	postIntensity,
} = require('./otherControllers');

module.exports = {
	userControllers,
	getInfo,
	postInfo,
	postIntensity,
};
