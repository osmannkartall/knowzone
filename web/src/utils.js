/* eslint-disable import/prefer-default-export */
import POST_TYPES from './constants/post-types';
import { BE_ROUTES } from './constants/routes';

export function preparePost(form) {
  let route;
  const post = {
    description: form.description,
    images: form.images,
    topics: form.topics,
    links: form.links,
    owner: form.owner,
  };

  if (form.type === POST_TYPES.BUG_FIX.value) {
    post.error = form.error;
    post.solution = form.solution;
    route = BE_ROUTES.BUG_FIXES;
  } else if (form.type === POST_TYPES.TIP.value) {
    route = BE_ROUTES.TIPS;
  }

  return { post, route };
}

export function convertDate(dateStr) {
  return new Date(dateStr).toLocaleString('en-GB');
}

/**
 * Converts buffer to Base64 string or returns itself if it is Base64 string already.
 * Note: It is useful if the buffer used in the components comes from the backend in different ways.
 * @param {(string|Object)} buffer - Buffer
 * @param {(Object)} buffer.data - Buffer as byte array
 * @returns Returns Base64 string representation of buffer.
 */
export function bufferToBase64(buffer) {
  if (buffer.data) {
    return btoa(
      buffer.data.reduce((data, byte) => data + String.fromCharCode(byte), ''),
    );
  }
  return buffer;
}

export function createFile(item) {
  const c = bufferToBase64(item.content);
  const byteString = atob(c);
  const ab = byteString.length;
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new File([ia], item.name, { type: item.mime });
}
