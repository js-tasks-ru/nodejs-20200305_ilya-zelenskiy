const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const limitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
    const pathname = url.parse(req.url).pathname.slice(1);

    if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end('not allowed');
        return;
    }

    const filepath = path.join(__dirname, 'files', pathname);

    switch (req.method) {
        case 'POST':

            const file = fs.createWriteStream(filepath, {flags: 'wx'});
            const limitStream = new limitSizeStream({limit: 1e6});

            file.on('error', err => {
                if (err.code === 'EEXIST') {
                    res.statusCode = 409;
                    res.end('file already exists')
                }

                res.statusCode = 500;
                res.end('something wrong');
            });

            limitStream.on('error', err => {
              if(err.code === 'LIMIT_EXCEEDED') {
                res.statusCode = 413;
                res.end('file is too big');

                fs.unlink(filepath, () => {});
                return;
              }
            });

            req.pipe(limitStream).pipe(file);

            file.on('close', () => {
              res.statusCode = 201;
              res.end('saved');
            });

            req.on('aborted', () => {
                fs.unlink(filepath, () => {});
            });

            break;

        default:
            res.statusCode = 501;
            res.end('Not implemented');
    }
});

module.exports = server;
