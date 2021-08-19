const TipModel = require('../models/Tip');

class SearchService {
  // eslint-disable-next-line class-methods-use-this
  async getPostsByOwner(owner) {
    const posts = await TipModel.aggregate([
      { $match: { owner } },
      { $addFields: { type: 'tip', id: '$_id' } },
      {
        $unionWith: {
          coll: 'bugfixes',
          pipeline: [
            { $match: { owner } },
            { $addFields: { type: 'bugFix', id: '$_id' } },
          ],
        },
      },
      { $sort: { createdAt: -1, updatedAt: -1 } },
      { $project: { _id: 0, __v: 0 } },
    ]);

    return posts;
  }
}

module.exports = SearchService;
