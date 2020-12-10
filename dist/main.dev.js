"use strict";

var http = require('http');

var fs = require('fs');

var url = require('url');

var qs = require('querystring');

function templateHTML(title, li, body, control) {
  return "\n    <!doctype html>\n    <html>\n      <head>\n        <title>WEB1 - ".concat(title, "</title>\n        <meta charset=\"utf-8\">\n      </head>\n      <body>\n        <h1><a href=\"/\">WEB</a></h1>\n        <input id=\"night_day\" type=\"button\" value=\"night\" onclick=\"\n          nightDayHandler(this);\n        \">\n        <ol>\n          ").concat(li, "\n        </ol>\n        ").concat(control, "\n        ").concat(body, "\n      </body>\n    </html>\n    ");
}

function templateList(files) {
  var li = '';
  files.forEach(function (file) {
    li += "<li><a href=\"/?id=".concat(file, "\">").concat(file, "</a></li>");
  });
  return li;
}

var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathName = url.parse(_url, true).pathname;
  var folder = './data/';

  if (pathName === '/') {
    if (queryData.id === undefined) {
      fs.readdir(folder, function (err, files) {
        var title = 'Welcome';
        var description = 'Hellow, Node js';
        var list = templateList(files);
        var template = templateHTML(title, list, "<h2>".concat(title, "</h2><article>").concat(description, "</article>"), '<a href="/create">Create</a>');
        response.writeHead(200);
        response.end(template);
      });
    } else {
      fs.readdir(folder, function (err, files) {
        fs.readFile("data/".concat(queryData.id), 'utf8', function (err, description) {
          var title = queryData.id;
          var list = templateList(files);
          var template = templateHTML(title, list, "<h2>".concat(title, "</h2><article>").concat(description, "</article>"), '<a href="/create">Create</a> <a href="/update">Update</a>');
          response.writeHead(200);
          response.end(template);
        });
      });
    }
  } else if (pathName === '/create') {
    fs.readdir(folder, function (err, files) {
      var title = 'Welcome';
      var description = 'Hellow, Node js';
      var list = templateList(files);
      var template = templateHTML(title, list, "\n        <form action=\"/create_process\" method=\"POST\">\n          <p><input placeholder=\"title\" type=\"input\" name=\"title\"/></p>\n          <p><textarea placeholder=\"description\" name=\"description\" rows=8></textarea></p>\n          <p><input type=\"submit\"/></p>\n        </form>\n        ");
      response.writeHead(200);
      response.end(template);
    });
  } else if (pathName === '/create_process') {
    var body = '';
    request.on('data', function (data) {
      body += data;
    });
    request.on('end', function () {
      var post = qs.parse(body);
      var title = post.title;
      var description = post.description;
      fs.writeFile("data/".concat(title), description, 'utf8', function (err) {
        if (err) throw err;
        response.writeHead(302, {
          location: "/?id=".concat(title)
        });
        response.end();
      });
    });
  } else {
    response.writeHead(404);
    response.end('404 not found');
  }
});
app.listen(3000);