const { Schema, model } = require('mongoose');
const basePostObject = require('./BasePost');

const tipSchema = new Schema(
  { ...basePostObject },
  { timestamps: true },
);

tipSchema.set('toJSON', {
  transform(_, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

const Tip = model('Tip', tipSchema);

module.exports = Tip;
