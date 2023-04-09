export default class BaseRepository {
  constructor(model) {
    this.model = model;
    this.limit = 10;
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

  async find(fields, projection, cursor) {
    let formattedFields = fields;
    const [nextCreatedAt, nextId] = (cursor ?? '').split('_');

    if (nextCreatedAt && nextId) {
      formattedFields = {
        $and: [
          fields,
          {
            $or: [{
              createdAt: { $lt: new Date(nextCreatedAt) },
            }, {
              createdAt: new Date(nextCreatedAt),
              _id: { $lt: nextId },
            }],
          },
        ],
      };
    }

    if (projection && !projection.createdAt) {
      projection.createdAt = 1;
    }

    const records = await this.model.find(formattedFields, projection)
      .sort({ createdAt: -1, _id: -1 })
      .limit(this.limit);

    const hasNext = records.length === this.limit;
    let next = null;

    if (records.length) {
      const lastRecord = records[records.length - 1];
      next = `${lastRecord.createdAt.toISOString()}_${lastRecord._id}`;
    }

    return { records, hasNext, next };
  }

  async findWithoutPagination(fields, projection) {
    return this.model.find(fields, projection).limit(this.limit);
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
