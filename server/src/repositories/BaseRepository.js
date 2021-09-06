class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async create(record) {
    let result;

    try {
      result = await this.model.create(record);
    } catch (err) {
      console.log(err.name, err.message);
      result = err.message;
    }

    return result;
  }

  async findAll() {
    const records = await this.model.find({}, null, { sort: { createdAt: -1 } });
    return records;
  }

  async findById(id) {
    const record = await this.model.findById(id);
    return record;
  }

  async updateById(id, record) {
    const result = await this.model.findByIdAndUpdate(id, record, {
      new: true,
    });
    return result;
  }

  async deleteById(id) {
    await this.model.findByIdAndRemove(id);
    return `Deleted the record with the ${id}`;
  }

  async deleteAll() {
    await this.model.deleteMany({});
    return 'Delete all records';
  }
}

module.exports = BaseRepository;
