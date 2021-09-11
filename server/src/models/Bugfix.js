const { Schema, model } = require('mongoose');
const basePostObject = require('./BasePost');
const { maxLengthMessage, transformToJSON } = require('../utils');

const MAX_LEN_ERROR = 4000;
const MAX_LEN_SOLUTION = 4000;

const bugfixObject = {
  ...basePostObject,
  ...{
    error: {
      type: String,
      required: true,
      maxLength: [MAX_LEN_ERROR, maxLengthMessage(MAX_LEN_ERROR)],
    },
    solution: {
      type: String,
      required: true,
      maxLength: [MAX_LEN_SOLUTION, maxLengthMessage(MAX_LEN_SOLUTION)],
    },
  },
};

const bugfixSchema = new Schema(
  bugfixObject,
  { timestamps: true },
);

transformToJSON(bugfixSchema);

const Bugfix = model('Bugfix', bugfixSchema);

module.exports = Bugfix;
