const { Schema } = require('mongoose');
const { isMimeValid, isLengthBetween, maxLengthMessage } = require('../utils');

const MAX_NUM_TOPICS = 5;
const MIN_NUM_TOPICS = 1;
const MAX_NUM_IMAGES = 2;
const MAX_NUM_LINKS = 5;
const MAX_LEN_DESCRIPTION = 1000;
const ACCEPTED_MIMES = ['image/png', 'image/jpeg', 'image/gif'];

const validateMime = () => [
  (mime) => isMimeValid(ACCEPTED_MIMES, mime),
  (props) => `Unsupported mime-type, RECEIVED: ${props.value}`,
];

const validateArrayLength = (name, max, min = 0) => [
  (items) => isLengthBetween(items, max, min),
  (props) => `Number of ${name} should be in [${min}, ${max}], RECEIVED: ${props.value.length}`,
];

const basePostObject = {
  owner: {
    id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    username: {
      type: String,
      required: true,
      match: /^@?([a-z0-9_]){1,15}$/,
    },
    name: {
      type: String,
      required: true,
      // TODO: match: /^([a-zA-Z]+\s)[a-zA-Z]+$/,
    },
  },
  links: {
    type: [String],
    validate: validateArrayLength('links', MAX_NUM_LINKS),
  },
  topics: {
    type: [
      {
        type: String,
        match: /^@?([a-z0-9-]){1,30}$/,
        lowercase: true,
      },
    ],
    required: true,
    validate: validateArrayLength('topics', MAX_NUM_TOPICS, MIN_NUM_TOPICS),
  },
  description: {
    // trim: true,
    type: String,
    required: true,
    maxLength: [MAX_LEN_DESCRIPTION, maxLengthMessage(MAX_LEN_DESCRIPTION)],
  },
  images: {
    type: [
      {
        name: String,
        content: {
          type: Buffer,
          required: true,
        },
        mime: {
          type: String,
          required: true,
          validate: validateMime(),
        },
      },
    ],
    validate: validateArrayLength('images', MAX_NUM_IMAGES),
  },
};

module.exports = basePostObject;
