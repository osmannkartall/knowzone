const mongoose = require('mongoose');

const tipSchema = new mongoose.Schema(
  {
    owner: String,
    links: [String],
    topics: [String],
    description: String,
  },
  { timestamps: true },
);

tipSchema.set('toJSON', {
  transform(_, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

const Tip = mongoose.model('Tip', tipSchema);

module.exports = Tip;
