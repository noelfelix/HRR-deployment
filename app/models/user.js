var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var mongoose = require('mongoose');


db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!

  var userSchema = mongoose.Schema({
      username: String,
      password: String
  });

  userSchema.methods.initialize = function() {
    this.hashPassword();
  };

  userSchema.methods.comparePassword = function(attemptedPassword, callback) {
    bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
      callback(isMatch);
    });
  };

  userSchema.methods.hashPassword = function(){
    var cipher = Promise.promisify(bcrypt.hash);
    return cipher(this.password, null, null).bind(this)
    .then(function(hash) {
      this.password = hash;
    });
  };

  var User = mongoose.model('User', userSchema);

  module.exports = User;
});
