// Create web server
// Load the http module to create an http server.
var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');
var qs = require('querystring');
var comments = [];

// Configure our HTTP server to respond with Hello World to all requests.
var server = http.createServer(function (request, response) {
    var urlPath = url.parse(request.url).pathname;
    if (urlPath === '/comment') {
        if (request.method === 'POST') {
            var body = '';
            request.on('data', function (data) {
                body += data;
            });

            request.on('end', function () {
                var comment = qs.parse(body);
                comments.push(comment);
                response.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                response.end('Thanks for the comment!');
            });
        } else {
            var allComments = '';
            comments.forEach(function (comment) {
                allComments += 'Name: ' + comment.name + ', Comment: ' + comment.comment + '\n';
            });

            response.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            response.end(allComments);
        }
    } else {
        var filename = path.join(__dirname, urlPath);
        fs.exists(filename, function (exists) {
            if (!exists) {
                response.writeHead(404, {
                    'Content-Type': 'text/plain'
                });
                response.end('Page not found');
                return;
            }

            fs.readFile(filename, 'utf8', function (err, data) {
                if (err) {
                    response.writeHead(500, {
                        'Content-Type': 'text/plain'
                    });
                    response.end('Internal Server Error');
                    return;
                }

                response.writeHead(200);
                response.end(data);
            });
        });
    }
});

// Listen on port 8000, IP defaults to
