import { debounce } from 'lodash';
import { useMemo } from 'react';
import POST_TYPES from './constants/post-types';

export function preparePost(form) {
  const { route } = POST_TYPES.get(form.type);
  const post = {
    description: form.description,
    images: form.images,
    topics: form.topics,
    links: form.links,
    owner: form.owner,
  };

  if (form.type === POST_TYPES.get('bugfix').value) {
    post.error = form.error;
    post.solution = form.solution;
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

function isValidObject(object) {
  return object && object.constructor === Object;
}

function areJSONValuesDifferent(oldValue, newValue) {
  return JSON.stringify(oldValue) !== JSON.stringify(newValue);
}

function createDiffObject(oldObject, newObject) {
  let diffObject = {};
  const fields = Object.keys(oldObject);

  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];

    if (field in newObject) {
      if (areJSONValuesDifferent(oldObject[field], newObject[field])) {
        diffObject[field] = newObject[field];
      }
    } else {
      diffObject = {};
      break;
    }
  }

  return diffObject;
}

export function getChangesInObject(oldObject, newObject) {
  let diffObject;

  if (isValidObject(oldObject) && isValidObject(newObject)) {
    diffObject = createDiffObject(oldObject, newObject);
  } else {
    diffObject = {};
  }

  return diffObject;
}

export function isObjectEmptyOrNotValid(object) {
  const isValid = isValidObject(object);
  const isEmpty = isValid && Object.keys(object).length < 1;

  return isEmpty || !isValid;
}

export function areObjectsEqual(object1, object2) {
  return isValidObject(object1)
    && isValidObject(object2)
    && !areJSONValuesDifferent(object1, object2);
}

export function useMemoAndDebounce(handler, waitMilliseconds = 100) {
  const debouncedHandler = () => debounce(handler, waitMilliseconds);

  return useMemo(debouncedHandler, [handler, waitMilliseconds]);
}
