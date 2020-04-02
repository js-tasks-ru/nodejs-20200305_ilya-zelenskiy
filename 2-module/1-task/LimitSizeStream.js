const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.limit = options.limit;
    this.total = 0;
  }

  _transform(chunk, encoding, callback) {

    let wordLength = chunk.toString().length;
    this.limit -= wordLength;

    if(this.limit >= 0) {
      callback(null, chunk);
    } else {
      callback(new LimitExceededError());
    }

  }

}

module.exports = LimitSizeStream;
