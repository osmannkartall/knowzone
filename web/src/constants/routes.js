import POST_TYPES from './post-types';

export const FE_ROUTES = Object.freeze({
  TIPS: POST_TYPES.get('tip').route,
  BUG_FIXES: POST_TYPES.get('bugfix').route,
  YOUR_POSTS: 'posts',
  SEARCH_RESULTS: 'results',
  NOT_FOUND: '404',
  LOGIN: 'login',
  REGISTER: 'register',
});

export const BE_ROUTES = Object.freeze({
  TIPS: POST_TYPES.get('tip').route,
  BUG_FIXES: POST_TYPES.get('bugfix').route,
  SEARCH: 'search',
  SEARCH_FILTER: 'search/filter',
  LOGIN: 'login',
  LOGOUT: 'logout',
  REGISTER: 'register',
  IS_USER_LOGGED_IN: 'is-user-logged-in',
});
