const express = require('express');

const userRouter = express.Router();
const {
	userControllers,
} = require('../controllers');

userRouter.post('/login', async (req, res, next) => {
	try {
		const result = await userControllers.login(req, res);
		res.end(result);
	} catch (err) {
		next(err);
	}
});

userRouter.delete('/logout', async (req, res, next) => {
	try {
		const result = await userControllers.logout(req, res);
		res.end(result);
	} catch (err) {
		next(err);
	}
});

userRouter.post('/register', async (req, res, next) => {
	try {
		const result = await userControllers.register(req, res);
		res.end(result);
	} catch (err) {
		next(err);
	}
});

userRouter.delete('/delete', async (req, res, next) => {
	try {
		const result = await userControllers.deleteUser(req, res);
		res.end(result);
	} catch (err) {
		next(err);
	}
});

module.exports = userRouter;
