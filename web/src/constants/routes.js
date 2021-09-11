import POST_TYPES from './post-types';

export const FE_ROUTES = Object.freeze({
  TIPS: POST_TYPES.get('tip').route,
  BUG_FIXES: POST_TYPES.get('bugfix').route,
  YOUR_POSTS: 'posts',
  SEARCH_RESULTS: 'results',
  NOT_FOUND: '404',
});

export const BE_ROUTES = Object.freeze({
  TIPS: POST_TYPES.get('tip').route,
  BUG_FIXES: POST_TYPES.get('bugfix').route,
  LOGIN: 'login',
  SEARCH: 'search',
  SEARCH_FILTER: 'search/filter',
});
