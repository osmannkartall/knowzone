import PostRepository from '../post/postRepository.js';
import FormRepository from '../form/formRepository.js';

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
  const formsObject = forms.reduce((result, item) => ({ ...result, [item.type.name]: item }), {});

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

export default { search };
