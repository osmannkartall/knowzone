/* eslint-disable import/prefer-default-export */
import POST_TYPES from './constants/post-types';

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
    route = 'bugFixes';
  } else if (form.type === POST_TYPES.TIP.value) {
    route = 'tips';
  }

  return { post, route };
}

export function convertDate(dateStr) {
  return new Date(dateStr).toLocaleString('en-GB');
}

export function bufferToBase64(content) {
  if (content.data) {
    return btoa(
      content.data.reduce((data, byte) => data + String.fromCharCode(byte), ''),
    );
  }
  return content;
}

export function createFileFromBase64(item) {
  const c = bufferToBase64(item.content);
  const byteString = atob(c);
  const ab = byteString.length;
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new File([ia], item.name, { type: item.mime });
}
