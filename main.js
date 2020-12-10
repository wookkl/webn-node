const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');
function templateHTML(title, li, body, control) {
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
        ${control}
        ${body}
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
        const template = templateHTML(
          title,
          list,
          `<h2>${title}</h2><article>${description}</article>`,
          '<a href="/create">Create</a>'
          );
        response.writeHead(200);
        response.end(template);
      })
    } else {
      fs.readdir(folder, (err, files) => {
        fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description) {
          const title = queryData.id;
          const list = templateList(files);
          const template = templateHTML(
            title,
            list,
            `<h2>${title}</h2><article>${description}</article>`,
            `<a href="/create">Create</a> 
            <a href="/update?id=${title}">Update</a> 
            <form action="delete_process" method="POST">
              <input type="hidden" name="id" value="${title}"/>
              <input type="submit" value="delete"/>
            </form>`
            );
          response.writeHead(200);
          response.end(template);
        })
      });
    }
  } 
  else if (pathName === '/create'){
    fs.readdir(folder, (err, files) => {
      const title = 'Welcome';
      const description = 'Hellow, Node js';
      const list = templateList(files);
      const template = templateHTML(title,
        list,
        `
        <form action="/create_process" method="POST">
          <p><input placeholder="title" type="input" name="title"/></p>
          <p><textarea placeholder="description" name="description" rows=8></textarea></p>
          <p><input type="submit"/></p>
        </form>
        `,
        ''
        );
      response.writeHead(200);
      response.end(template);
    })
  }
  else if (pathName === '/create_process') {
    let body = '';
    request.on('data', (data) => {
      body += data;
    });
    request.on('end', () => {
      const post = qs.parse(body);
      const title = post.title;
      const description = post.description;
      fs.writeFile(`data/${title}`, description, 'utf8', (err) => {
        if (err) throw err;
        response.writeHead(302, {location: `/?id=${title}`});
        response.end();
      })
    });
  }
  else if (pathName === '/update'){
    fs.readdir(folder, (err, files) => {
      fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description) {
        const title = queryData.id;
        const list = templateList(files);
        const template = templateHTML(title,
          list,
          `
          <form action="/update_process" method="POST">
          <input type="hidden" name="id" value="${title}"/>
            <p><input placeholder="title" type="input" name="title" value="${title}"/></p>
            <p><textarea placeholder="description" name="description" rows=8>${description}</textarea></p>
            <p><input type="submit"/></p>
          </form>
          `,
          `<a href="/create">Create</a> <a href="/update?id=${title}">Update</a>`,
          );
        response.writeHead(200);
        response.end(template);
      })
    })
  }
  else if (pathName === '/update_process'){
    let body = '';
    request.on('data', (data) => {
      body += data;
    });
    request.on('end', () => {
      const post = qs.parse(body);
      const id = post.id;
      const newTitle = post.title;
      const newDescription = post.description;
      fs.rename(`data/${id}`, `data/${newTitle}`, (err) => {
        fs.writeFile(`data/${newTitle}`, newDescription, 'utf8', (err) => {
          if (err) throw err;
          response.writeHead(302, {location: `/?id=${newTitle}`});
          response.end();
        })
      })
    });
  }
  else if (pathName === '/delete_process'){
    let body = '';
    request.on('data', (data) => {
      body += data;
    });
    request.on('end', () => {
      const post = qs.parse(body);
      const id = post.id;
      fs.unlink(`data/${id}`, (err) => {
        if (err) {
          console.error(err)
          return
        }
        response.writeHead(302, {location: '/'});
        response.end();
      })
    });
  } else {
    response.writeHead(404);
    response.end('404 not found');
  }
});
app.listen(3000);