const mongoose = require('mongoose');

const bugFixSchema = new mongoose.Schema(
  {
    owner: { id: mongoose.Schema.Types.ObjectId, username: String, name: String },
    links: [String],
    topics: [String],
    error: String,
    solution: String,
    description: String,
    images: [{
      name: String,
      content: Buffer,
      mime: String,
    }],
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
