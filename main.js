const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');
const mysql = require('mysql');
const template = require('./lib/template.js');
const path = require('path');
const sanitizeHtml = require('sanitize-html');
const conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'nodejs',
  password : '1111',
  database : 'wookkl'
});
conn.connect();
const app = http.createServer(function(request,response){
  const _url = request.url;
  const queryData = url.parse(_url, true).query;
  const pathName = url.parse(_url, true).pathname;
  const folder = './data/';
  if(pathName === '/') {
    if(queryData.id === undefined) {
      conn.query(`SELECT * FROM topic`, (err, topics, fields) => {
        console.log(topics);
        const title = 'Welcome';
        const description = 'Hellow, Node js';
        const list = template.list(topics);
        const html = template.html(
              title,
              list,
              `<h2>${title}</h2><article>${description}</article>`,
              '<a href="/create">Create</a>'
              );
        response.writeHead(200);
        response.end(html);
      })
    } else {
      conn.query('SELECT * FROM topic', (err, topics) => {
        if(err) {
          throw err;
        }
        conn.query(`SELECT * FROM topic WHERE id=?`,[queryData.id], (err2, topic) => { 
          if(err2) {
            throw err2;
          }
          const title = topic[0].title;
          const description = topic[0].description;
          const list = template.list(topics);
          const html = template.html(
                  sanitizedTitle,
                  list,
                  `<h2>${title}</h2><article>${description}</article>`,
                  `<a href="/create">Create</a> 
                  <a href="/update?id=${queryData.id}">Update</a> 
                  <form action="delete_process" method="POST">
                    <input type="hidden" name="id" value="${queryData.id}"/>
                    <input type="submit" value="delete"/>
                  </form>`
                  );
          response.writeHead(200);
          response.end(html);
        });
      });
    }
  } else if (pathName === '/create'){
    fs.readdir(folder, (err, files) => {
      const title = 'Welcome';
      const description = 'Hellow, Node js';
      const list = template.list(files);
      const html = template.html(title,
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
      response.end(html);
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
      const filterdId = path.parse(queryData.id)
      fs.readFile(`data/${filterdId}`, 'utf8', function(err, description) {
        const title = queryData.id;
        const list = template.list(files);
        const html = template.html(title,
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
        response.end(html);
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
      const filterdId = path.parse(id);

      fs.unlink(`data/${filterdId}`, (err) => {
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