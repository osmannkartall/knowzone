const mongoose = require('mongoose');

const bugFixSchema = new mongoose.Schema(
  {
    owner: String,
    links: [String],
    topics: [String],
    error: String,
    solution: String,
    description: String,
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

const BugFix = mongoose.model('BugFix', bugFixSchema);

module.exports = BugFix;
