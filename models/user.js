const mongoose = require('mongoose');
const config = require('../config.json');

mongoose.connect(config.mongoURI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const UserSchema = new mongoose.Schema({
	_id: {
		type: String,
		required: true,
	},
	banned: {
		type: Boolean,
		default: false,
	},
	created: {
		type: Number,
	},
	token: {
		type: String,
		required: true,
	},
	username: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model('user', UserSchema);
