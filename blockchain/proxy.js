const http = require('http')
    , fs = require('fs')
    , httpProxy = require('http-proxy');
//
// Create your proxy server and set the target in the options.
//
httpProxy.createServer({
  target: {
    host: 'localhost',
    port: 8545
  },
  ssl: {
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem')
  }
}).listen(8009);
