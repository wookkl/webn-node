const http = require('http');
const fs = require('fs');
const url = require('url');
function templateHTML(title, li, description) {
  return `
    <!doctype html>
    <html>
      <head>
        <title>WEB1 - ${title}</title>
        <meta charset="utf-8">
      </head>
      <body>
        <h1><a href="/">WEB</a></h1>
        <input id="night_day" type="button" value="night" onclick="
          nightDayHandler(this);
        ">
        <ol>
          ${li}
        </ol>
        <h2>${title}</h2> 
        <article>
        ${description}
        </article>
      </body>
    </html>
    `;
}
function templateList(files) {
  let li = '';
  files.forEach(file => {
    li += `<li><a href="/?id=${file}">${file}</a></li>`
  });
  return li;
}
const app = http.createServer(function(request,response){
  const _url = request.url;
  const queryData = url.parse(_url, true).query;
  const pathName = url.parse(_url, true).pathname;
  const folder = './data/';
  
  if(pathName === '/') {
    if(queryData.id === undefined) {
      fs.readdir(folder, (err, files) => {
        const title = 'Welcome';
        const description = 'Hellow, Node js';
        const list = templateList(files);
        const template = templateHTML(title,list,description);
        response.writeHead(200);
        response.end(template);
      })
    } else {
      fs.readdir(folder, (err, files) => {
        fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description) {
          const title = queryData.id;
          const list = templateList(files);
          const template = templateHTML(title,list,description);
          response.writeHead(200);
          response.end(template);
        })
      });
    }
  } else {
    response.writeHead(404);
    response.end(`404 not found`);
  }
});
app.listen(3000);