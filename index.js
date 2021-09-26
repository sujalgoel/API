require('./DiscordStrategy');

const cors = require('cors');
const express = require('express');
const passport = require('passport');
const model = require('./models/user');
const config = require('./config.json');
const functions = require('./functions/functions');
const session = require('express-session');

const app = express();

// Initialize
app.use(cors());
app.use(
	session({
		secret: config.secret,
		resave: true,
		saveUninitialized: false,
	}),
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));

// View Engine
app.set('view engine', 'ejs');

// Routes
app.get('/login', passport.authenticate('discord'));
app.get(
	`/${config.callbackURL}`,
	passport.authenticate('discord', {
		failureRedirect: '/login',
		successRedirect: '/dashboard',
	}),
);

// Main Endpoints
app.get('/', async (req, res) => {
	if (!req.user) {
		res.render('index', {
			baseURI: config.baseURI,
		});
	} else {
		res.redirect('/dashboard');
	}
});

app.get('/dashboard', functions.isAuthorized, async (req, res) => {
	const data = await model.findOne({ _id: req.user.id });
	res.render('dashboard', {
		date: new Date(data.created).toString(),
		id: data._id,
		token: data.token,
		banned: data.banned,
		baseURI: config.baseURI,
		username: data.username,
	});
});

app.get('/regen', functions.isAuthorized, async (req, res) => {
	const data = await model.findOne({ _id: req.user.id });
	data.token = functions.generateToken();
	data.save();
	res.redirect('/dashboard');
});

app.get('/logout', (req, res) => {
	if (req.user) {
		req.logout();
		res.redirect('/');
	} else {
		res.redirect('/');
	}
});

// API Endpoints
app.use('/meme', functions.auth, require('./routes/meme'));

// Start the server on dedicated port
app.listen(config.port, () => {
	console.log(`API listening on PORT:${config.port}`);
});
