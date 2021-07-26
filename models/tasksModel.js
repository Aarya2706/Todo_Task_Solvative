const e = require('express');
const mongoose = require('mongoose');

const task = mongoose.Schema(
	{
		title: String,
		status: Boolean,
	},
	{ timestamps: true }
);

const data = mongoose.model('tasks', task);

module.exports = data;
