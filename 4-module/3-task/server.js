const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'DELETE':
      if(pathname.indexOf('\/') >= 0) {
        res.statusCode = 400;
        res.end('Path not available');
      } else {
        fs.unlink(filepath, err => {
          if(!err) {
            return res.end('ok');
          }
          if(err.code === 'ENOENT') {
            res.statusCode = 404;
            res.end('file not found');
          } else {
            res.statusCode = 500;
            res.end('internal server error');
          }
        });
      }
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
