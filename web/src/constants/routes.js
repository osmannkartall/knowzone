import POST_TYPES from './post-types';

export const FE_ROUTES = Object.freeze({
  TIPS: POST_TYPES.get('tip').route,
  BUG_FIXES: POST_TYPES.get('bugFix').route,
  YOUR_POSTS: 'your-posts',
  SEARCH_RESULTS: 'search-results',
  NOT_FOUND: '404',
});

export const BE_ROUTES = Object.freeze({
  TIPS: POST_TYPES.get('tip').route,
  BUG_FIXES: POST_TYPES.get('bugFix').route,
  LOGIN: 'login',
  SEARCH: 'search',
  SEARCH_FILTER: 'search/filter',
});
