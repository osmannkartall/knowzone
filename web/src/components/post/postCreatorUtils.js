export const NUMERIC_KEY_PREFIX = 'k_';

export function removeNumericKeyPrefix(content) {
  const result = {};

  Object.entries(content ?? {}).forEach(([k, v]) => {
    result[k.slice(NUMERIC_KEY_PREFIX.length)] = v;
  });

  return result;
}

export function addNumericKeyPrefix(content) {
  const result = {};

  Object.entries(content ?? {}).forEach(([k, v]) => {
    result[NUMERIC_KEY_PREFIX + k] = v;
  });

  return result;
}
