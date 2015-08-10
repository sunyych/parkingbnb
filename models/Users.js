var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var UserSchema = new mongoose.Schema({
	username: { type: String, lowercase: true, unique: true},
	email: {type: String, unique: true, lowercase: true},
	passwordHash: String,
	salt: String,
	images: [{type: mongoose.Schema.Types.ObjectId, ref: 'Image'}]
});

UserSchema.methods.setPassword = function(password) {
	this.salt = crypto.randomBytes(16).toString('hex');
	this.passwordHash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

UserSchema.methods.validatePassword = function(password) {
	var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
	return (hash === this.passwordHash);
};

UserSchema.methods.generateJWT = function() {
	var today = new Date();
	var exp = new Date(today);
	exp.setDate(today.getDate() + 36500); //expires in 100 years (365 days * 100 years);
	return jwt.sign({
		_id: this._id,
		username: this.username,
		exp: parseInt(exp.getTime() / 1000) //get the time in milliseconds and convert to seconds
	}, 'Hashbrowns');
};

mongoose.model('User', UserSchema);