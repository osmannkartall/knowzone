class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async create(record) {
    const result = await this.model.create(record);

    return result;
  }

  async findAll() {
    const result = await this.model.find({}, null, { sort: { createdAt: -1 } });

    return result;
  }

  async findById(id) {
    const record = await this.model.findById(id);

    return record;
  }

  async updateById(id, update) {
    const filter = { _id: id };
    const resultAfterUpdate = await this.model.findOneAndUpdate(filter, update, { new: true });

    return resultAfterUpdate;
  }

  async deleteById(id) {
    await this.model.findByIdAndRemove(id);
  }

  async deleteAll() {
    await this.model.deleteMany({});
  }
}

module.exports = BaseRepository;
