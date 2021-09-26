const { reddit } = require('reddit.images');
const router = require('express').Router();

router.get('/', async (req, res) => {
	try {
		const data = await reddit.FetchRandomMeme({
			images: true,
		});
		const message = {
			success: 'true',
			data: data,
		};
		res.set('Content-Type', 'application/json');
		res.send(JSON.stringify(message, null, 2));
	} catch (err) {
		const message = {
			success: 'false',
			data: {
				message: 'An error occured! Please try again later.',
			},
		};
		res.set('Content-Type', 'application/json');
		return res.status(400).send(JSON.stringify(message, null, 2));
	}
});

module.exports = router;