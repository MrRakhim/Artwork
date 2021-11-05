const axios = require('axios');
const { Router } = require('express');
const router = Router({ mergeParams: true });
const config = require('../config/config.json');

let objectIDs = [];
const objects = {};
const offset = 5;

(async () => {
	try {
		objectIDs = (await axios.get(`${config.api}/objects`)).data?.objectIDs;
		console.log('Data loaded');
	} catch (error) {
		console.log('Problems with parsing object ids');
		console.dir(error);
	}
})();




async function getObject (id) {
	try {
		if (objects[id]) return objects[id]
		const object = (await axios.get(`${config.api}/objects/${id}`)).data;
		objects[id] = object;
		setTimeout(() => {
			delete objects[id];
		}, 1000 * 60 * 5);
		return objects[id];
	} catch (error) {
		console.log('Promblems with parsing object where id:', id);	
		console.dir(error);
	}
};

router.get('/artworks', async (req, res) => {
	try {
		let { page } = req.query;
		if (page) { 
			page = parseInt(page);
			if (!page) return res.status(400).json({ message: 'Invalid type for "page"' });
		} else {
			page = 1;
		}

		const artworks = await Promise.all(objectIDs.slice(offset * page - offset, offset * page).map(id => getObject(id)));;
		Promise.all(objectIDs.slice(offset * page + 1 - offset, offset * page + 1).map(id => getObject(id)));;

		return res.render('objects', { artworks, page })
	} catch (error) {
		console.dir(error);
	}
});

module.exports = router;