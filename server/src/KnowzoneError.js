class KnowzoneError extends Error {
  constructor({ type, code, description, stack, ...rest }) {
    super(description);

    this.type = type;
    this.code = code;
    this.description = description;
    this.stack = stack;
    this.data = rest;

    Object.setPrototypeOf(this, KnowzoneError.prototype);
  }
}

module.exports = KnowzoneError;
