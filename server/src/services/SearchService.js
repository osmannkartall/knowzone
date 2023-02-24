const { ObjectId } = require('mongoose').Types;

class SearchService {
  static async getPostsByOwner(ownerId) {
    return [];
    // const posts = await TipModel.aggregate([
    //   { $match: { 'owner.id': ObjectId(ownerId) } },
    //   { $addFields: { type: 'tip', id: '$_id' } },
    //   {
    //     $unionWith: {
    //       coll: 'bugfixes',
    //       pipeline: [
    //         { $match: { 'owner.id': ObjectId(ownerId) } },
    //         { $addFields: { type: 'bugfix', id: '$_id' } },
    //       ],
    //     },
    //   },
    //   { $sort: { createdAt: -1, updatedAt: -1 } },
    //   { $project: { _id: 0, __v: 0 } },
    // ]);

    // return posts;
  }

  static async filter(info) {
    return [];
    //   const filterInfo = info;

    //   let searchQuery = null;
    //   if ('searchText' in filterInfo) {
    //     searchQuery = { $regex: `\\b${filterInfo.searchText.trim()}\\b`, $options: 'i' };
    //     delete filterInfo.searchText;
    //   }

    //   let postType = null;
    //   if ('postType' in filterInfo) {
    //     postType = filterInfo.postType;
    //     delete filterInfo.postType;
    //   }

    //   let query = {};
    //   const filterQuery = { createdAt: {}, updatedAt: {} };
    //   Object.entries(filterInfo).forEach(([k, v]) => {
    //     if (k === 'author') {
    //       filterQuery['owner.username'] = { $regex: `\\b${v.trim()}\\b`, $options: 'i' };
    //     } else if (k === 'topics') {
    //       filterQuery[k] = { $in: v.map((topic) => new RegExp(`\\b${topic.trim()}\\b`, 'i')) };
    //     } else if (k === 'createdStartDate') {
    //       const date = new Date(filterInfo.createdStartDate);
    //       date.setUTCHours(0, 0, 0, 0);
    //       filterQuery.createdAt.$gte = date;
    //     } else if (k === 'createdEndDate') {
    //       const date = new Date(filterInfo.createdEndDate);
    //       date.setUTCHours(23, 59, 59, 999);
    //       filterQuery.createdAt.$lte = date;
    //     } else if (k === 'modifiedStartDate') {
    //       const date = new Date(filterInfo.modifiedStartDate);
    //       date.setUTCHours(0, 0, 0, 0);
    //       filterQuery.updatedAt.$gte = date;
    //     } else if (k === 'modifiedEndDate') {
    //       const date = new Date(filterInfo.modifiedEndDate);
    //       date.setUTCHours(23, 59, 59, 999);
    //       filterQuery.updatedAt.$lte = date;
    //     } else {
    //       filterQuery[k] = { $regex: `\\b${v.trim()}\\b`, $options: 'i' };
    //     }
    //   });

    //   if (!Object.keys(filterQuery.createdAt).length) {
    //     delete filterQuery.createdAt;
    //   }
    //   if (!Object.keys(filterQuery.updatedAt).length) {
    //     delete filterQuery.updatedAt;
    //   }

    //   const searchQueryFilter = {};
    //   if (searchQuery) {
    //     searchQueryFilter.$or = [
    //       { 'owner.username': searchQuery },
    //       { description: searchQuery },
    //     ];
    //     if (postType !== 'tip') {
    //       searchQueryFilter.$or.push({ error: searchQuery });
    //       searchQueryFilter.$or.push({ solution: searchQuery });
    //     }
    //   }

    //   if (Object.keys(searchQueryFilter).length && Object.keys(filterQuery).length) {
    //     query.$and = [searchQueryFilter, filterQuery];
    //   } else if (Object.keys(searchQueryFilter).length) {
    //     query = searchQueryFilter;
    //   } else {
    //     query = filterQuery;
    //   }

  //   if (postType === 'bugfix') {
  //     return BugfixModel.find(query).sort({ createdAt: -1 });
  //   }
  //   if (postType === 'tip') {
  //     return TipModel.find(query).sort({ createdAt: -1 });
  //   }
  //   const bugfixPosts = await BugfixModel.find(query);
  //   const tipPosts = await TipModel.find(query);
  //   const posts = Array.from(new Set(bugfixPosts.concat(tipPosts)));
  //   posts.sort((a, b) => (new Date(a.createdAt) < new Date(b.createdAt) ? 1 : -1));
  //   return posts;
  }
}

module.exports = SearchService;
