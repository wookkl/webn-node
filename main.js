const http = require('http');
const url = require('url');
const topic = require("./src/topic");
const author = require("./src/author");
const app = http.createServer(function(request,response){
  const _url = request.url;
  const queryData = url.parse(_url, true).query;
  const pathName = url.parse(_url, true).pathname;
  if(pathName === '/') {
    if(queryData.id === undefined) {
      topic.home(request, response);
    } else {
      topic.detail(request, response);
    }
  } else if (pathName === '/create') {
    topic.create(request, response);
  } else if (pathName === '/create_process') {
    topic.create_process(request, response);
  } else if (pathName === '/update'){
    topic.update(request, response);
  } else if (pathName === '/update_process'){
    topic.update_process(request, response);
  } else if (pathName === '/delete_process'){
    topic.delete_process(request, response);
  } else if (pathName === '/author'){
    author.detail(request, response);
  } else if (pathName === '/author/create_process'){
    author.create_process(request, response);
  } else if (pathName === '/author/update'){
    author.update(request, response);
  } else if (pathName === '/author/update_process'){
    author.update_process(request, response);
  } else if (pathName === '/author/delete_process'){
    author.delete_process(request, response);
  }
  else {
    response.writeHead(404);
    response.end('404 not found');
  }
});
app.listen(3000);