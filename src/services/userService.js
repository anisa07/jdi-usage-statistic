const User = require('../mongoDb/models/user');
const { Error } = require('../utils/error');

// pagination sucks(((
// const foundProducts = await Product.find({name:regex})
//     .skip((resPerPage * page) - resPerPage)
//     .limit(resPerPage);

const postUser = ({ user, password, token }) => {
	try {
		const newUser = new User({
			user,
			password,
			token,
		});

		return newUser.save();
	} catch (e) {
		throw new Error(500, 'Internal server error!');
	}
};

const getUserByName = (user) => {
	try {
		return User.findOne({ user });
	} catch (e) {
		throw new Error(500, 'Internal server error!');
	}
};

const deleteUser = (user) => {
	try {
		return User.deleteOne({ user });
	} catch (e) {
		throw new Error(500, 'Internal server error!');
	}
};

const updateUser = ({
	user, token,
}) => {
	try {
		return User.findOneAndUpdate({ user }, { token }, {
			new: true,
			upsert: true,
			runValidators: true,
			useFindAndModify: false,
		});
	} catch (e) {
		throw new Error(500, 'Internal server error!');
	}
};

const getAllUsers = () => {
	try {
		return User.find();
	} catch (e) {
		throw new Error(500, 'Internal server error!');
	}
};

module.exports = {
	postUser,
	getUserByName,
	updateUser,
	deleteUser,
	getAllUsers,
};
