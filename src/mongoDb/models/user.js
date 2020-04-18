/**
 * @swagger
 *  components:
 *    schemas:
 *      User:
 *        type: object
 *        required:
 *          - user
 *          - token
 *        properties:
 *          user:
 *            type: string
 *          token:
 *            type: string
 *        example:
 *           user: RJelly
 *           token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXNzd29yZCI6IkJlc3RUZXN0MTIzNCQkJCIsImlhdCI6MTU4NzE2ODA1MH0.VcesJ7N3P9nLsNn0GtZ0c3OLjEr4jVP40xiWYYzXh7I
 */

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	user: {
		type: String,
		required: true
	},
	token: {
		type: String,
		required: true
	}
});

module.exports = mongoose.model('User', userSchema);
