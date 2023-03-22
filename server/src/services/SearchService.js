const PostModel = require('../models/Post');

function getReduceQueryForArrayToString() {
  return {
    $reduce: {
      input: {
        $map: {
          input: '$$this.v',
          in: { $toString: '$$this' },
        },
      },
      initialValue: '',
      in: { $concat: ['$$value', '$$this'] },
    },
  };
}

function getReduceQueryForContentField(searchText) {
  return {
    $expr: {
      $regexMatch: {
        input: {
          // collect value of content fields into a single string
          $reduce: {
            input: { $objectToArray: '$content' },
            initialValue: '',
            in: {
              $switch: {
                branches: [
                  {
                    case: { $eq: ['$$this.k', 'images'] },
                    then: '$$value',
                  },
                  {
                    case: { $eq: [{ $type: '$$this.v' }, 'array'] },
                    then: getReduceQueryForArrayToString(),
                  },
                  {
                    case: { $eq: [{ $type: '$$this.v' }, 'object'] },
                    then: '$$value',
                  },
                ],
                default: { $concat: ['$$value', '$$this.v'] },
              },
            },
          },
        },
        regex: searchText,
        options: 'i',
      },
    },
  };
}

function prepareFilterQuery(info) {
  const filterQuery = { 'owner.id': info.ownerId };

  if (info.createdAtStartDate) {
    filterQuery.createdAt = {};
    const date = new Date(info.createdAtStartDate);
    date.setUTCHours(0, 0, 0, 0);
    filterQuery.createdAt.$gte = date;
  }

  if (info.createdAtEndDate) {
    if (!filterQuery.createdAt) {
      filterQuery.createdAt = {};
    }
    const date = new Date(info.createdAtEndDate);
    date.setUTCHours(23, 59, 59, 999);
    filterQuery.createdAt.$lte = date;
  }

  if (info.updatedAtStartDate) {
    filterQuery.updatedAt = {};
    const date = new Date(info.updatedAtStartDate);
    date.setUTCHours(0, 0, 0, 0);
    filterQuery.updatedAt.$gte = date;
  }

  if (info.updatedAtEndDate) {
    if (!filterQuery.updatedAt) {
      filterQuery.updatedAt = {};
    }
    const date = new Date(info.updatedAtEndDate);
    date.setUTCHours(23, 59, 59, 999);
    filterQuery.updatedAt.$lte = date;
  }

  if (info.topics) {
    filterQuery.topics = {
      $in: info.topics.map((topic) => new RegExp(`\\b${topic.trim()}\\b`, 'i')),
    };
  }

  if (info.type) {
    filterQuery.type = new RegExp(`\\b${info.type.trim()}\\b`, 'i');
  }

  return filterQuery;
}

function prepareSearchTextQuery(info) {
  let searchTextQuery = {};

  if (info.searchText) {
    // type and topics shouldn't be searched if they are in filters already.
    searchTextQuery.$or = [getReduceQueryForContentField(info.searchText)];

    if (!info.type) {
      searchTextQuery.$or.push({ type: new RegExp(`\\b${info.searchText.trim()}\\b`, 'i') });
    }

    if (!info.topics) {
      searchTextQuery.$or.push(
        { topics: { $in: [new RegExp(`\\b${info.searchText.trim()}\\b`, 'i')] } },
      );
    }
  } else if (info.content) {
    searchTextQuery = getReduceQueryForContentField(info.content);
  }

  return searchTextQuery;
}

async function search(info) {
  const filterQuery = prepareFilterQuery(info);
  const searchTextQuery = prepareSearchTextQuery(info);
  let query = {};

  if (Object.keys(searchTextQuery).length) {
    query.$and = [searchTextQuery, filterQuery];
  } else {
    query = filterQuery;
  }

  return PostModel.find(query);
}

module.exports = { search, getReduceQueryForContentField };
