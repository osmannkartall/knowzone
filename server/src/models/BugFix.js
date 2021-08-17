const mongoose = require('mongoose');

const bugFixSchema = new mongoose.Schema(
  {
    owner: String,
    links: [String],
    tags: [String],
    error: String,
    solution: String,
    description: String,
  },
  { timestamps: true },
);

bugFixSchema.set('toJSON', {
  virtuals: true,
  transform(_, ret) { delete ret._id; },
});

const BugFix = mongoose.model('BugFix', bugFixSchema);

module.exports = BugFix;
