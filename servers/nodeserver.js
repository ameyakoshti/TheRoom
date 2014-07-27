var fs = require('fs');
var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});  
  var contents = fs.readFileSync('test.txt').toString();
  res.end(contents);
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');