/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
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

/**
 * Finds the changed values in the old object.
 * @param {(Object)} oldObj - Object
 * @param {(Object)} newObj - Object with same fields as oldObj
 * @returns Returns the diff object containing only the fields with the new values or
 * returns empty object if there is no difference or
 * returns undefined if one of the objects has different field than other or at least
 * one of the parameters is not Object.
 */
export function diff(oldObj, newObj) {
  if (oldObj.constructor !== Object || newObj.constructor !== Object) {
    return undefined;
  }

  let diffObj = {};

  if (oldObj && newObj) {
    for (const prop in oldObj) {
      if (Object.prototype.hasOwnProperty.call(oldObj, prop)
          && Object.prototype.hasOwnProperty.call(newObj, prop)) {
        if (JSON.stringify(oldObj[prop]) !== JSON.stringify(newObj[prop])) {
          diffObj[prop] = newObj[prop];
        }
      } else {
        diffObj = undefined;
        break;
      }
    }
  }

  return diffObj;
}

export function isObjectEmpty(obj) {
  if (obj.constructor !== Object) {
    return undefined;
  }

  for (const _ in obj) {
    return false;
  }

  return true;
}

export function isEqual(obj1, obj2) {
  if (obj1.constructor !== Object || obj2.constructor !== Object) {
    return undefined;
  }
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}
