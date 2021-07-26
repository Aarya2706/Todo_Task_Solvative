const express = require('express');
const app = express();
const ejs = require('ejs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const tasksModel = require('./models/tasksModel');
const port = 3002;

mongoose
	.connect('mongodb://localhost:27017/Solvative', {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log('Database Connected');
	})
	.catch((err) => {
		console.log(err);
	});

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
	res.render('homepage');
});

app.get('/tasks', (req, res) => {
	let record = tasksModel.find({});
	record.exec((err, records) => {
		if (err) {
			console.log(err);
		} else {
			res.send({ records: records });
		}
	});
});

app.get('/addtasks', (req, res) => {
	res.render('AddTask');
});

app.post('/addtasks', (req, res) => {
	const title = req.body.title;
	const record = new tasksModel({
		title: title,
		status: false,
	});
	record.save();
	res.send(record);
	// res.render('tasks');
});

app.get('/edit/:_id', function (req, res) {
	tasksModel.findById(req.params._id, function (err, records) {
		if (err) {
			console.log('get data error =>', err);
		} else {
			res.render('EditForm', { records: records });
		}
	});
});

app.post('/edit', function (req, res) {
	console.log('get id =>', req.body.id);
	let status = req.body.status === 'true';
	let myBodyData = tasksModel.findByIdAndUpdate(req.body.id, {
		title: req.body.title,
		status: status,
	});
	myBodyData.exec((err) => {
		if (err) {
			res.status(400).send({ Error: err });
		} else {
			res.send({ status: 'ok' });
		}
	});
});

app.delete('/delete/:_id', function (req, res) {
	tasksModel.findByIdAndRemove(req.params._id, function (err, records) {
		if (err) {
			console.log('get data error =>', err);
		} else {
			res.send({ status: 'ok' });
		}
	});
});

app.listen(port, function () {
	console.log('connected succesfully at Port:', port);
});
