const PostModel = require('../models/Post');

class SearchService {
  static async getPostsByOwner(ownerId) {
    return PostModel(
      { owner: { id: ownerId } },
      { _id: 0, __v: 0 },
      { createdAt: -1, updatedAt: -1 },
    );
  }

  static async filter(info) {
    const filterInfo = info;

    let searchQuery = null;
    if ('searchText' in filterInfo) {
      searchQuery = { $regex: `\\b${filterInfo.searchText.trim()}\\b`, $options: 'i' };
      delete filterInfo.searchText;
    }

    let query = {};
    const filterQuery = { createdAt: {}, updatedAt: {} };
    Object.entries(filterInfo).forEach(([k, v]) => {
      if (k === 'author') {
        filterQuery['owner.username'] = { $regex: `\\b${v.trim()}\\b`, $options: 'i' };
      } else if (k === 'topics') {
        filterQuery[k] = { $in: v.map((topic) => new RegExp(`\\b${topic.trim()}\\b`, 'i')) };
      } else if (k === 'createdAtStartDate') {
        const date = new Date(filterInfo.createdAtStartDate);
        date.setUTCHours(0, 0, 0, 0);
        filterQuery.createdAt.$gte = date;
      } else if (k === 'createdAtEndDate') {
        const date = new Date(filterInfo.createdAtEndDate);
        date.setUTCHours(23, 59, 59, 999);
        filterQuery.createdAt.$lte = date;
      } else if (k === 'updatedAtStartDate') {
        const date = new Date(filterInfo.updatedAtStartDate);
        date.setUTCHours(0, 0, 0, 0);
        filterQuery.updatedAt.$gte = date;
      } else if (k === 'updatedAtEndDate') {
        const date = new Date(filterInfo.updatedAtEndDate);
        date.setUTCHours(23, 59, 59, 999);
        filterQuery.updatedAt.$lte = date;
      } else if (k === 'type') {
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
      ];
      // TODO: Add fields of content object except content.images to the searchQuery
    }

    const isSearchText = Object.keys(searchQueryFilter).length;
    const isFilteredUsed = Object.keys(filterQuery).length;

    if (isSearchText && isFilteredUsed) {
      query.$and = [searchQueryFilter, filterQuery];
    } else if (isSearchText) {
      query = searchQueryFilter;
    } else {
      query = filterQuery;
    }

    return PostModel.find(query).sort({ createdAt: -1 });
  }
}

module.exports = SearchService;
