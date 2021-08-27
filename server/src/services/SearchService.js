const { ObjectId } = require('mongoose').Types;
const TipModel = require('../models/Tip');
const BugFixModel = require('../models/BugFix');

class SearchService {
  // eslint-disable-next-line class-methods-use-this
  async getPostsByOwner(ownerId) {
    const posts = await TipModel.aggregate([
      { $match: { 'owner.id': ObjectId(ownerId) } },
      { $addFields: { type: 'tip', id: '$_id' } },
      {
        $unionWith: {
          coll: 'bugfixes',
          pipeline: [
            { $match: { 'owner.id': ObjectId(ownerId) } },
            { $addFields: { type: 'bugFix', id: '$_id' } },
          ],
        },
      },
      { $sort: { createdAt: -1, updatedAt: -1 } },
      { $project: { _id: 0, __v: 0 } },
    ]);

    return posts;
  }

  // eslint-disable-next-line class-methods-use-this
  async filter(info) {
    const dateKeys = ['createdStartDate', 'createdEndDate', 'modifiedStartDate', 'modifiedEndDate'];

    let searchQuery = null;
    if ('searchText' in info) {
      searchQuery = { $regex: `\\b${info.searchText.trim()}\\b`, $options: 'i' };
      // eslint-disable-next-line no-param-reassign
      delete info.searchText;
    }

    let postType = null;
    if ('postType' in info) {
      postType = info.postType;
      // eslint-disable-next-line no-param-reassign
      delete info.postType;
    }

    let query = {};
    const filterQuery = { createdAt: {}, updatedAt: {} };
    Object.entries(info).forEach(([k, v]) => {
      if (k === 'author') {
        filterQuery['owner.username'] = { $regex: `\\b${v.trim()}\\b`, $options: 'i' };
      } else if (k === 'topics') {
        filterQuery[k] = { $in: v.map((topic) => new RegExp(`\\b${topic.trim()}\\b`, 'i')) };
      } else if (k === 'createdStartDate') {
        filterQuery.createdAt.$gte = new Date(info.createdStartDate);
      } else if (k === 'createdEndDate') {
        filterQuery.createdAt.$lte = new Date(info.createdEndDate);
      } else if (k === 'modifiedStartDate') {
        filterQuery.updatedAt.$gte = new Date(info.modifiedStartDate);
      } else if (k === 'modifiedEndDate') {
        filterQuery.updatedAt.$lte = new Date(info.modifiedEndDate);
      } else {
        filterQuery[k] = { $regex: `\\b${v.trim()}\\b`, $options: 'i' };
      }
    });

    if (!Object.keys(filterQuery.createdAt).length) {
      delete filterQuery.createdAt;
    } else if (!Object.keys(filterQuery.updatedAt).length) {
      delete filterQuery.updatedAt;
    }

    const searchQueryFilter = {};
    if (searchQuery) {
      searchQueryFilter.$or = [
        { 'owner.username': searchQuery },
        { description: searchQuery },
      ];
      if (postType !== 'tip') {
        searchQueryFilter.$or.push({ error: searchQuery });
        searchQueryFilter.$or.push({ solution: searchQuery });
      }
    }

    if (Object.keys(searchQueryFilter).length && Object.keys(filterQuery).length) {
      query.$and = [searchQueryFilter, filterQuery];
    } else if (Object.keys(searchQueryFilter).length) {
      query = searchQueryFilter;
    } else {
      query = filterQuery;
    }

    if (postType === 'bugFix') {
      return BugFixModel.find(query).sort({ createdAt: -1, updatedAt: -1 });
      // eslint-disable-next-line no-else-return
    } else if (postType === 'tip') {
      return TipModel.find(query).sort({ createdAt: -1, updatedAt: -1 });
    }
    const bugFixPosts = await BugFixModel.find(query);
    const tipPosts = await TipModel.find(query);
    const posts = Array.from(new Set(bugFixPosts.concat(tipPosts)));
    return posts;
  }
}

module.exports = SearchService;
