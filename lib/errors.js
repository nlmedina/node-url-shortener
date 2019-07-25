class ValidationError extends Error {
  constructor(message, fields) {
    super(message);
    this.status = 400;
    this.fields = fields;
  }
}

class ServerError extends Error {
  constructor(message) {
    super(message);
    this.status = 500;
  }
}

module.exports = {
  ValidationError,
  ServerError
};
