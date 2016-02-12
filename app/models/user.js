var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    username: String,
    password: String
});

userSchema.methods.initialize = function() {
  this.password = this.hashPassword(this.password);
};

userSchema.methods.comparePassword = function(attemptedPassword, callback) {
  bcrypt.compare(this.password, attemptedPassword, function(err, isMatch) {
    callback(isMatch);
  });
};

userSchema.methods.hashPassword = function(password){
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(password, null, null).bind(this)
  .then(function(hash) {
    return hash;
  });
};

var User = mongoose.model('User', userSchema);

module.exports = User;
