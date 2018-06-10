const express = require('express');
const bodyParser = require('body-parser');
const Promise = require('bluebird');
const sqlite = require('sqlite');
const app = express();

const dbPromise = Promise.resolve()
	.then(() => sqlite.open(__dirname + '/database.sqlite'), { Promise })
	.then(db => db.migrate({ force: 'last' }));

app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

app.route('/space')
	.get((req, res) => {
		dbPromise
			.then(db => db.all('SELECT id, name, type FROM SpaceObjects'))
			.then(data => res.json(data));
	})
	.post((req, res) => {
		let body = req.body;
		dbPromise
			.then(db => {
				db.get(`INSERT INTO SpaceObjects (name, type) VALUES ('${body.name}', '${body.type}')`);
				return db;
			})
			.then(db => db.get('SELECT last_insert_rowid() as id'))
			.then(data => res.json({ id: data.id, name: body.name, type: +body.type }));
	})
	.put((req, res) => {
		let body = req.body;
		dbPromise
			.then(db => db.get(`UPDATE SpaceObjects SET name = '${body.name}', type = '${body.type}' WHERE ID = '${body.id}'`))
			.then(() => res.json({ id: +body.id, name: body.name, type: +body.type }));
	})
	.delete((req, res) => {
		dbPromise
			.then(db => db.get(`DELETE FROM SpaceObjects WHERE ID = '${req.body.id}'`))
			.then(() => res.json({ id: +req.body.id }));
	});
app.listen('8080');