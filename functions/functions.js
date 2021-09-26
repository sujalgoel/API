const model = require('../models/user');

module.exports = {
	isAuthorized: function(req, res, next) {
		if (req.user) {
			next();
		} else {
			res.redirect('/login');
		}
	},
	generateToken: function() {
		let token = '';
		const characters =
			'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		for (let i = 0; i < Math.floor(Math.random() * 10) + 70; i++) {
			token += characters.charAt(Math.floor(Math.random() * characters.length));
		}
		return token;
	},
	auth: async function(req, res, next) {

		const authheader = req.header('Authorization');
		const token = authheader && authheader.split(' ')[1];
		const validator = authheader && authheader.split(' ')[0];

		if (!token && !validator) {
			const message = {
				success: 'false',
				data: {
					message: 'You access to this endpoint has been denied.',
				},
			};
			res.set('Content-Type', 'application/json');
			return res.status(401).send(JSON.stringify(message, null, 2));
		}

		if (validator.toLowerCase() !== 'sujal') {
			const message = {
				success: 'false',
				data: {
					message: 'Format for Authorization: Sujal YOUR_TOKEN',
				},
			};
			res.set('Content-Type', 'application/json');
			return res.status(401).send(JSON.stringify(message, null, 2));
		}

		if (!token) {
			const message = {
				success: 'false',
				data: {
					message: 'Your access to this endpoint has been denied.',
				},
			};
			res.set('Content-Type', 'application/json');
			return res.status(401).send(JSON.stringify(message, null, 2));
		}

		const user = await model.findOne({ token });

		if (!user) {
			const message = {
				success: 'false',
				data: {
					message: 'The provided token is invalid.',
				},
			};
			res.set('Content-Type', 'application/json');
			return res.status(400).send(JSON.stringify(message, null, 2));
		}

		if (user.banned) {
			const message = {
				success: 'false',
				data: {
					message: 'You are banned from using the API.',
				},
			};
			res.set('Content-Type', 'application/json');
			return res.status(400).send(JSON.stringify(message, null, 2));
		} else {
			next();
		}
	},
};
