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
        const date = new Date(info.createdStartDate);
        date.setUTCHours(0, 0, 0, 0);
        filterQuery.createdAt.$gte = date;
      } else if (k === 'createdEndDate') {
        const date = new Date(info.createdEndDate);
        date.setUTCHours(23, 59, 59, 999);
        filterQuery.createdAt.$lte = date;
      } else if (k === 'modifiedStartDate') {
        const date = new Date(info.modifiedStartDate);
        date.setUTCHours(0, 0, 0, 0);
        filterQuery.updatedAt.$gte = date;
      } else if (k === 'modifiedEndDate') {
        const date = new Date(info.modifiedEndDate);
        date.setUTCHours(23, 59, 59, 999);
        filterQuery.updatedAt.$lte = date;
      } else {
        filterQuery[k] = { $regex: `\\b${v.trim()}\\b`, $options: 'i' };
      }
    });

    if (!Object.keys(filterQuery.createdAt).length) {
      delete filterQuery.createdAt;
    }
    if (!Object.keys(filterQuery.updatedAt).length) {
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

    console.log(query);
    if (postType === 'bugFix') {
      return BugFixModel.find(query).sort({ createdAt: -1 });
      // eslint-disable-next-line no-else-return
    } else if (postType === 'tip') {
      return TipModel.find(query).sort({ createdAt: -1 });
    }
    const bugFixPosts = await BugFixModel.find(query);
    const tipPosts = await TipModel.find(query);
    const posts = Array.from(new Set(bugFixPosts.concat(tipPosts)));
    posts.sort((a, b) => (new Date(a.createdAt) < new Date(b.createdAt) ? 1 : -1));
    return posts;
  }
}

module.exports = SearchService;
