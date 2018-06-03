var express = require('express');
var bodyParser = require('body-parser');
var Promise = require('bluebird');
var sqlite = require('sqlite');
var app = express();

const dbPromise = Promise.resolve()
	.then(() => sqlite.open(__dirname + '/database.sqlite'), { Promise })
	.then(db => db.migrate({ force: 'last' }));

app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/main.html');
});

app.route('/space')
	.get((req, res) => {
		dbPromise
			.then(db => db.all('SELECT id, name, type FROM SpaceObjects'))
			.then(spaceObjects => res.json(spaceObjects));
	})
	.head((req, res) => {
		dbPromise
			.then(db => db.all('SELECT id, name, type FROM SpaceObjects'))
			.then(spaceObjects => res.json(spaceObjects));
	})
	.post((req, res) => {
		var body = req.body;
		dbPromise.then(db => db.get(`INSERT INTO SpaceObjects (name, type) VALUES ('${body.name}', '${body.type}')`));
		res.json({ success: true });
	})
	.put((req, res) => {
		var body = req.body;
		dbPromise.then(db => db.get(`UPDATE SpaceObjects SET name = '${body.name}', type = '${body.type}' WHERE ID = '${body.id}'`));
		res.json({ success: true });
	})
	.delete((req, res) => {
		dbPromise.then(db => db.get(`DELETE FROM SpaceObjects WHERE ID = '${req.body.id}'`));
		res.json({ success: true });
	});
app.listen('8080');