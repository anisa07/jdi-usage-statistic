const User = require('../mongoDb/models/user');

// pagination sucks(((
// const foundProducts = await Product.find({name:regex})
//     .skip((resPerPage * page) - resPerPage)
//     .limit(resPerPage);

const postUser = ({ user, token }) => {
	const newUser = new User({
		user,
		token,
	});

	return newUser.save();
};

const getUserByName = (user) => User.findOne({ user });

const deleteAllUsers = () => User.deleteMany();

const updateUser = ({
	user, password, token,
}) => User.findOneAndUpdate({
	user,
	password,
}, { token }, {
	new: true,
	upsert: true,
	runValidators: true,
	useFindAndModify: false,
});

// POST to DB

module.exports = {
	postUser,
	getUserByName,
	updateUser,
	deleteAllUsers,
};
