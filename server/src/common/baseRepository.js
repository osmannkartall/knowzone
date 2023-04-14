export default class BaseRepository {
  constructor(model) {
    this.model = model;
    this.limit = 20;
  }

  async create(record) {
    return this.model.create(record);
  }

  async findAll(filter, projection) {
    return this.model.find(filter, projection);
  }

  async findById(id) {
    return this.model.findById(id);
  }

  async find(filter, projection, cursor) {
    const [nextCreatedAt, nextId] = (cursor ?? '').split('_');

    const newFilter = nextCreatedAt && nextId ? {
      $and: [
        filter,
        {
          $or: [{
            createdAt: { $lt: new Date(nextCreatedAt) },
          }, {
            createdAt: new Date(nextCreatedAt),
            _id: { $lt: nextId },
          }],
        },
      ],
    } : filter;
    if (projection && !projection.createdAt) {
      projection.createdAt = 1;
    }
    const options = { sort: { createdAt: -1, _id: -1 }, limit: this.limit };

    const records = await this.model.find(newFilter, projection, options);
    const hasNext = records.length === this.limit;
    const lastRecord = records[this.limit - 1];
    const newCursor = hasNext ? `${lastRecord.createdAt.toISOString()}_${lastRecord._id}` : null;
    const noResult = !(nextCreatedAt && nextId) && records.length === 0;

    return { records, hasNext, cursor: newCursor, noResult };
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
