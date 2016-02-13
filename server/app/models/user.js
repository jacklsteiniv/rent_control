var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

//the user model/schema

var UserSchema = new Schema({
  name: String,
  email: {type: String, required: true, index: {unique: true}},
  password: {type: String, require: true, select: false},
  zip: Number,
  priorities: [{ //this is all the info that will be added
  //after a user signs up and answers onboarding questions.
    budget: Number,
    schools: Boolean,
    crime: Boolean,
    walkscore: Boolean
  }]
})

// Hash the password before the user is saved
UserSchema.pre('save', function(next) {
var user = this;

// Hash the password only if the password has been changed or user is new
if (!user.isModified('password')) return next();

// Generate the hash
bcrypt.hash(user.password, null, null, function(err, hash) {
if (err) return next(err);
// Change the password to the hashed version
user.password = hash;
next();
});
});

// Compare a given password with the database hash
UserSchema.methods.comparePassword = function(password) {
var user = this;

return bcrypt.compareSync(password, user.password);
};
// return the model
module.exports = mongoose.model('User', UserSchema);
