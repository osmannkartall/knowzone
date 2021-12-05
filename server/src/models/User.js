const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      lowercase: true,
      match: /^@?([a-z0-9_]){1,15}$/,
      index: { unique: true },
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      minLength: 3,
      maxLength: 254,
      lowercase: true,
      match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,7})+$/,
    },
    name: {
      type: String,
      trim: true,
      required: true,
      minLength: 3,
      maxLength: 50,
    },
    bio: {
      type: String,
      maxLength: 256,
    },
  },
);

const User = mongoose.model('User', userSchema);

module.exports = User;
