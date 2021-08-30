const mongoose = require('mongoose');

const tipSchema = new mongoose.Schema(
  {
    owner: { id: mongoose.Schema.Types.ObjectId, username: String, name: String },
    links: [String],
    topics: [String],
    description: String,
    images: [{
      name: String,
      data: Buffer,
    }],
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
