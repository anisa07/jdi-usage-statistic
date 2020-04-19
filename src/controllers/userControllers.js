const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const service = require('../services/index');

const saltRounds = process.env.SALT_ROUNDS;

const login = async (req, res) => {
	const { user, password } = req.body;
	const savedUser = await service.getUserByName(user);

	if (savedUser) {
		jwt.verify(savedUser.token, process.env.TOKEN_SALT, (err, decoded) => {
			if (decoded.user === user && decoded.password === password) {
				return res.status(200).json(savedUser);
			}
			return res.status(403).json('Incorrect user or password');
		});
	} else {
		return res.status(401).json('User does not exist');
	}
};

const register = async (req, res) => {
	const { user, password } = req.body;
	const userInDB = await service.getUserByName(user);

	if (!userInDB) {
		const token = jwt.sign({ user, password }, process.env.TOKEN_SALT);
		const newUser = await service.postUser({ user, token });
		return res.status(200).json(newUser);
	}
	return res.status(403).json('User already exist');
};

const logout = async (req, res) => {
	await req.logout();
	return res.status(200).json('success');
};
