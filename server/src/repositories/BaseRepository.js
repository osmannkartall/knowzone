class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async create(record) {
    return this.model.create(record);
  }

  async findAll() {
    return this.model.find({}, null, { sort: { createdAt: -1 } });
  }

  async findById(id) {
    return this.model.findById(id);
  }

  async updateById(id, update) {
    const filter = { _id: id };
    return this.model.findOneAndUpdate(filter, update, { new: true });
  }

  async deleteById(id) {
    return this.model.findByIdAndRemove(id);
  }

  async deleteAll() {
    return this.model.deleteMany({});
  }
}

module.exports = BaseRepository;
