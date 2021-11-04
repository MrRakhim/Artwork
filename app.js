const express = require('express');
require('express-async-errors');

console.log('Start app.js');

const app = express();
const PORT = 5522;
app
	.set('port', PORT)
	.set('view engine', 'ejs');

app
	.use('/public', express.static('public'))
	.use(express.json())
	.use(express.urlencoded({
		extended: true
	}))
	.get('/', async (req, res) => {
		const title = { title: 'Artwork' };
		return res.render('index', title);
	})
	.use((req, res, next) => {
		return res.status(404).json(new Response().error('Method not found'));
	});

app.listen(PORT, () => {
	console.log(`Server listening at http://localhost:${PORT}`);
});
	