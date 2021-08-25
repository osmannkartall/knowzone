/* eslint-disable import/prefer-default-export */
import POST_TYPES from './constants/post-types';

export function preparePost(form) {
  let route;
  const post = {
    description: form.description,
    // files: form.files,
    topics: form.topics,
    links: form.links,
    owner: form.owner,
  };

  if (form.type === POST_TYPES.BUG_FIX.value) {
    post.error = form.error;
    post.solution = form.solution;
    route = 'bugFixes';
  } else if (form.type === POST_TYPES.TIP.value) {
    route = 'tips';
  }

  return { post, route };
}
