import POST_TYPES from './constants/post-types';

export function preparePost(form) {
  const { route } = POST_TYPES.get(form.type);
  const post = {
    description: form.description,
    images: form.images,
    topics: form.topics,
    links: form.links,
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
