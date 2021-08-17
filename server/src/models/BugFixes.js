const mongoose = require('mongoose');

const bugFixesSchema = new mongoose.Schema(
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

bugFixesSchema.set('toJSON', {
  virtuals: true,
  transform(_, ret) { delete ret._id; },
});

const BugFix = mongoose.model('BugFix', bugFixesSchema);

module.exports = BugFix;