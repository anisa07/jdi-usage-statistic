const { userService } = require('../services/index');
const { Error } = require('../utils/error');
const {
	signToken, encryptPassword, verifyToken, verifyPassword, charsCorrect,
} = require('../utils/crypt');

const { AUTHORIZE_KEY } = process.env;

const login = async (req, res) => {
	const { user, password } = req.body;
	const userFromDb = await userService.getUserByName(user);

	if (!userFromDb) {
		throw new Error(404, 'User does not exist!');
	}
	const verifyPwd = await verifyPassword(password, userFromDb.password);
	const token = signToken({ user, password });

	if (verifyPwd) {
		await userService.updateUser({ user, token });
		return res.status(200).json({ user, token });
	}

	throw new Error(401, 'User or password is not correct!');
};

const register = async (req, res) => {
	const { user, password, superKey } = req.body;
	const userInDB = await userService.getUserByName(user);
	const encryptPwd = await encryptPassword(password);
	const token = signToken({ user, password: encryptPwd });

	if (!charsCorrect(user) || !charsCorrect(password)) {
		throw new Error(400, 'User or password length is too short or their format incorrect');
	}

	if (AUTHORIZE_KEY !== superKey) {
		throw new Error(401, 'User key is not correct');
	}

	if (userInDB) {
		throw new Error(403, `User ${user} already exists`);
	}

	try {
		await userService.postUser({ user, password: encryptPwd, token });
		return res.status(200).json({
			user,
			token,
		});
	} catch (e) {
		throw new Error(500, 'Internal server error');
	}
};

const logout = async (req, res) => {
	const { user } = req.body;
	// await userService.deleteUser(user);
	await userService.updateUser({ user, token: null });
	return res.status(200).json({
		user: null,
		token: null,
	});
};

const deleteUser = async (req, res) => {
	const { user, password } = req.body;
	const { authorization } = req.headers;

	const verify = verifyToken(authorization);
	const verifyPwd = await verifyPassword(password, verify.password);

	if (verify.user === user && verifyPwd) {
		await userService.deleteUser(user);
		return res.status(200).json(`User ${user} was deleted!`);
	}

	throw new Error(401, 'User is not authorized!');
};

module.exports = {
	logout,
	register,
	login,
	deleteUser,
};
