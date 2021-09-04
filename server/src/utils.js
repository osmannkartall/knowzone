function isMimeValid(acceptedMimes, mime) {
  return acceptedMimes.includes(mime);
}

function isLengthBetween(items, max, min = 0) {
  return items && items.length >= min && items.length <= max;
}

function maxLengthMessage(len) {
  return `Received value longer than maximum allowed length(${len}).`;
}

module.exports = {
  isMimeValid,
  isLengthBetween,
  maxLengthMessage,
};
