function isAnyFieldFilled(object) {
  return Object.values(object).some(
    (field) => (Array.isArray(field) ? field.length : field || false),
  );
}

function isValidMaxLenKeys(object, max = 0) {
  return Object.keys(object).every((k) => k?.length <= max);
}

export default {
  isAnyFieldFilled,
  isValidMaxLenKeys,
};
