var mongoose = require('mongoose');

var SpotSchema = new mongoose.Schema({
	address: {type: String, required: true},
	size: String,
	title: String,
	time: String,
	rate: String,
	type: String,
	description: String,
	user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	img: {type: String, required: true},
	created: Date,
	deleted: Date
});

mongoose.model('Spot', SpotSchema);