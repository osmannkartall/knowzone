import { Schema } from 'mongoose';

const owner = {
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
    trim: true,
    minLength: 3,
    maxLength: 50,
  },
};

export default owner;
