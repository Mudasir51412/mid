const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  photo: String,
});

module.exports = mongoose.model('User', UserSchema);
