var http = require('http'),
    httpProxy = require('http-proxy');

// Create a proxy server with custom application logic
var proxy = httpProxy.createProxyServer({ secure: false });

// Modify Referer and Host header when proxing requests
proxy.on('proxyReq', function(proxyReq, req, res, options) {
  proxyReq.setHeader('Referer', 'https://www.jsdelivr.net/');
  proxyReq.setHeader('Host', 'fastly.jsdelivr.net');
});

// Catch errors
proxy.on('error', function (err, req, res) {
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  });
  res.end('Something went wrong. And we are reporting a custom error message.');
  console.log(err, req, res);
});

var server = http.createServer(function(req, res) {
  // Handle request with proxy
  //console.log(req.rawHeaders);
  proxy.web(req, res, {
    target: 'https://fastly.jsdelivr.net'
  });
});

const PORT = process.env.PORT || 3002;
console.log("listening on port " + PORT.toString())
server.listen(PORT);
