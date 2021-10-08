export const DESCRIPTION_CONSTRAINTS = Object.freeze({
  name: 'description',
  minLen: 1,
  maxLen: 1000,
});

export const ERROR_CONSTRAINTS = Object.freeze({
  name: 'error',
  minLen: 1,
  maxLen: 4000,
});

export const SOLUTION_CONSTRAINTS = Object.freeze({
  name: 'solution',
  minLen: 1,
  maxLen: 4000,
});

export const LINKS_CONSTRAINTS = Object.freeze({
  name: 'links',
  minLen: 0,
  maxLen: 5,
});

export const TOPICS_CONSTRAINTS = Object.freeze({
  name: 'topics',
  minLen: 1,
  maxLen: 5,
  pattern: {
    value: '^@?([a-z0-9-]){1,30}$',
    message: 'Invalid topic(s). A topic should be at most 30 alphanumeric characters and it may also contain hyphen.',
  },
});

const isPatternInvalid = (patternValue, item) => {
  const isCheckRequired = patternValue !== undefined && item.length > 0;
  if (isCheckRequired) {
    const matches = item.map((i) => i.match(patternValue));
    return matches.includes(null);
  }
  return false;
};

const makeInitalUpper = (str) => str[0].toUpperCase() + str.slice(1);

export function validate(formField, formFieldErrorCheck, setFormFieldErrorCheck, validationObject) {
  const { name, minLen, maxLen, pattern } = validationObject;

  let isInvalid = true;
  let text = '';

  if (maxLen !== undefined && formField.length > maxLen) {
    text = `${makeInitalUpper(name)} cannot exceed ${maxLen} characters.`;
  } else if (minLen !== undefined && formField.length < minLen) {
    text = `Please fill in the ${name} section.`;
  } else if (isPatternInvalid(pattern?.value, formField)) {
    text = pattern.message;
  } else {
    isInvalid = false;
  }
  setFormFieldErrorCheck({ ...formFieldErrorCheck, text, isInvalid });

  return !isInvalid;
}
