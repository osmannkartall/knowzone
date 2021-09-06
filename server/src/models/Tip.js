const { Schema, model } = require('mongoose');
const basePostObject = require('./BasePost');
const { transformToJSON } = require('../utils');

const tipSchema = new Schema(
  { ...basePostObject },
  { timestamps: true },
);

transformToJSON(tipSchema);

const Tip = model('Tip', tipSchema);

module.exports = Tip;
