export default class BaseRepository {
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

  async find(fields, projection) {
    return this.model.find(fields, projection, { sort: { createdAt: -1 } });
  }

  async findOne(conditions, projection) {
    return this.model.findOne(conditions, projection);
  }

  async updateById(filter, updateQuery, options) {
    return this.model.findOneAndUpdate(filter, updateQuery, options);
  }

  async deleteOne(conditions) {
    return this.model.deleteOne(conditions);
  }

  async deleteMany(conditions) {
    return this.model.deleteMany(conditions);
  }
}
