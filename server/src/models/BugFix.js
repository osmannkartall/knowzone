const { Schema, model } = require('mongoose');

const MAX_NUM_TOPICS = 5;
const MIN_NUM_TOPICS = 1;
const MAX_NUM_IMAGES = 2;
const MAX_NUM_LINKS = 5;
const MAX_LEN_DESCRIPTION = 1000;
const MAX_LEN_ERROR = 4000;
const MAX_LEN_SOLUTION = 4000;

const ACCEPTED_MIMES = ['image/png', 'image/jpeg', 'image/gif'];

function isMimeValid(acceptedMimes, mime) {
  return acceptedMimes.includes(mime);
}

function isLengthBetween(items, max, min = 0) {
  return items && items.length >= min && items.length <= max;
}

const validateMime = () => [
  (mime) => isMimeValid(ACCEPTED_MIMES, mime),
  (props) => `Unsupported mime-type, RECEIVED: ${props.value}`,
];

const validateArrayLength = (name, max, min = 0) => [
  (items) => isLengthBetween(items, max, min),
  (props) => `Number of ${name} should be in [${min}, ${max}], RECEIVED: ${props.value.length}`,
];

const maxLengthMessage = (len) => `Received value longer than maximum allowed length(${len}).`;

const bugFixSchema = new Schema(
  {
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
  },
  { timestamps: true },
);

bugFixSchema.set('toJSON', {
  transform(_, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

const BugFix = model('BugFix', bugFixSchema);

module.exports = BugFix;
