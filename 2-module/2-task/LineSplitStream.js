const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
    constructor(options) {
        options.decodeStrings = false;
        super(options);
        this.buffer = '';
    }

    _transform(chunk, encoding, callback) {
        this.buffer += chunk.toString();
        callback();
    }

    _flush(callback) {
        let that = this;
        this.buffer.split(os.EOL).forEach(value => {
           that.push(value);
        });
        callback();
    }
}

module.exports = LineSplitStream;
