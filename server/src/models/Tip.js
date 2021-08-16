const mongoose = require('mongoose');

const tipSchema = new mongoose.Schema(
  {
    owner: String,
    links: [String],
    tags: [String],
    description: String,
  },
  { timestamps: true },
);

tipSchema.set('toJSON', {
  virtuals: true,
  transform(_, ret) { delete ret._id; },
});

const Tip = mongoose.model('Tip', tipSchema);

module.exports = Tip;
