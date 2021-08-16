const mongoose = require('mongoose');

const helloSchema = new mongoose.Schema(
  {
    name: String,
    age: Number,
  },
);

helloSchema.set('toJSON', {
  virtuals: true,
  transform(_, ret) { delete ret._id; },
});

const Hello = mongoose.model('Hello', helloSchema);

module.exports = Hello;
