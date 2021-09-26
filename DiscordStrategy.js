const passport = require('passport');
const config = require('./config.json');
const DiscordUser = require('./models/user');
const functions = require('./functions/functions');
const DiscordStrategy = require('passport-discord').Strategy;

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
	const user = await DiscordUser.findById(id);
	if (user) {
		done(null, user);
	}
});

passport.use(
	new DiscordStrategy(
		{
			clientID: config.clientID,
			clientSecret: config.clientSecret,
			callbackURL: config.callbackURL,
			scope: ['identify'],
		},
		async (accessToken, refreshToken, profile, done) => {
			try {
				const user = await DiscordUser.findOne({ _id: profile.id });
				if (user) {
					await user.updateOne({
						username: `${profile.username}#${profile.discriminator}`,
					});
					done(null, user);
				} else {
					const newUser = await DiscordUser.create({
						_id: profile.id,
						created: Date.now(),
						token: functions.generateToken(),
						username: `${profile.username}#${profile.discriminator}`,
					});
					const savedUser = await newUser.save();
					done(null, savedUser);
				}
			} catch (err) {
				console.log(err);
				done(err, null);
			}
		},
	),
);
