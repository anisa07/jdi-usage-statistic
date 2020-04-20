const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Error } = require('./error');

const SALT_ROUNDS = process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS, 10) : 9;
const { TOKEN_SALT } = process.env;

const encryptPassword = async (password) => {
	const salt = await bcrypt.genSalt(SALT_ROUNDS);
	return bcrypt.hash(password, salt);
};

const verifyToken = (token) => {
	try {
		return jwt.verify(token, TOKEN_SALT);
	} catch (err) {
		throw new Error(401, 'User is not authorized!');
	}
};

const verifyPassword = (password, hash) => bcrypt.compare(password, hash);

const signToken = ({ user, password }) => jwt.sign({
	user, password, exp: Math.floor(Date.now() / 1000) + (60 * 60),
}, TOKEN_SALT);

const charsCorrect = (word, len = 6) => {
	const re = /[^(),.?'":{}|<>\s[]]/g;

	if (word && word.length > len) {
		const reArr = re.exec(word);
		return !reArr;
	}

	return false;
};

module.exports = {
	encryptPassword,
	signToken,
	verifyToken,
	verifyPassword,
	charsCorrect,
};
