const mongoose = require('mongoose');
const { transformToJSON } = require('../utils');

const helloSchema = new mongoose.Schema(
  {
    name: String,
    age: Number,
  },
);

transformToJSON(helloSchema);

const Hello = mongoose.model('Hello', helloSchema);

module.exports = Hello;
