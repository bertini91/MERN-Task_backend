const mongoose = require("mongoose");
const UserSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
    trim: true /* Eliminara los espacios vacios al principio y al final */,
  },
  email: {
    type: String,
    require: true,
    trim: true,
    unique: true /* Debera ser único */,
  },
  password: {
    type: String,
    require: true,
    trim: true,
  },
  register: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("User", UserSchema);
