import PostRepository from '../post/postRepository.js';
import FormRepository from '../form/formRepository.js';
import PostModel from '../post/post.js';

const postRepository = new PostRepository();
const formRepository = new FormRepository();

function prepareFilterQuery(info) {
  const filterQuery = {};

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

  if (info.typeName) {
    filterQuery['type.name'] = new RegExp(`\\b${info.typeName.trim()}\\b`, 'i');
  }

  return filterQuery;
}

function prepareSearchTextQuery(info) {
  if (info.searchText) {
    return { $text: { $search: info.searchText } };
  }

  return {};
}

function convertFixedDate(since) {
  if (since === 'daily') {
    const now = new Date();
    const startOfDay = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
    );
    const endOfDay = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1) - 1,
    );

    return {
      createdAtStartDate: startOfDay.toISOString(),
      createdAtEndDate: endOfDay.toISOString(),
    };
  } if (since === 'weekly') {
    const now = new Date();
    const dayOfWeek = now.getUTCDay();
    const startOfWeek = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1),
      ),
    );
    const endOfWeek = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        startOfWeek.getUTCDate() + 6,
        23,
        59,
        59,
        999,
      ),
    );

    return {
      createdAtStartDate: startOfWeek.toISOString(),
      createdAtEndDate: endOfWeek.toISOString(),
    };
  } if (since === 'monthly') {
    const now = new Date();
    const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
    const endOfMonth = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59, 999),
    );

    return {
      createdAtStartDate: startOfMonth.toISOString(),
      createdAtEndDate: endOfMonth.toISOString(),
    };
  }

  return {};
}

async function search(info, cursor) {
  const filterQuery = prepareFilterQuery(info);
  const searchTextQuery = prepareSearchTextQuery(info);
  let query = {};

  if (Object.keys(searchTextQuery).length) {
    query.$and = [searchTextQuery, filterQuery];
  } else {
    query = filterQuery;
  }

  const posts = await postRepository.find(query, null, cursor);
  const typeIds = (posts.records ?? []).map((p) => p.type.id);
  const forms = await formRepository.findAll(
    { 'type.id': { $in: typeIds } },
    { type: 1, content: 1 },
  );
  const formsObject = forms.reduce((result, item) => ({ ...result, [item.type.id]: item }), {});

  return {
    records: {
      posts: posts.records,
      forms: formsObject,
    },
    hasNext: posts.hasNext,
    cursor: posts.cursor,
    noResult: posts.noResult,
  };
}

async function getPopularTopics() {
  return PostModel.aggregate([
    { $unwind: '$topics' },
    { $group: { _id: '$topics', count: { $sum: 1 } } },
    { $project: { topic: '$_id', count: 1, _id: 0 } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);
}

export default {
  search,
  convertFixedDate,
  getPopularTopics,
};
