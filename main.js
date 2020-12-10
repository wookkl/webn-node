const http = require('http');
const fs = require('fs');
const url = require('url');
const app = http.createServer(function(request,response){
    const _url = request.url;
    const queryData = url.parse(_url, true).query;
    const pathName = url.parse(_url, true).pathname;
    
    if(pathName === '/') {
      if(queryData.id === undefined) {
        title = 'Welcome';
        description = 'Hellow, Node js';
        const template = `
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
                <li><a href="/?id=HTML">HTML</a></li>
                <li><a href="/?id=CSS">CSS</a></li>
                <li><a href="/?id=JavaScript">JavaScript</a></li>
              </ol>
              <h2>${title}</h2> 
              <article>
              ${description}
              </article>
            </body>
          </html>
          `;
          response.writeHead(200);
          response.end(template);
      } else {
        fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description) {
          const title = queryData.id;
          const template = `
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
                <li><a href="/?id=HTML">HTML</a></li>
                <li><a href="/?id=CSS">CSS</a></li>
                <li><a href="/?id=JavaScript">JavaScript</a></li>
              </ol>
              <h2>${title}</h2> 
              <article>
              ${description}
              </article>
            </body>
          </html>
        `;
          response.writeHead(200);
          response.end(template);
        });
      }
      

    } else {
      response.writeHead(404);
      response.end(`404 not found`);
    }
    
    
 
});
app.listen(3000);