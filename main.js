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
      conn.query(`SELECT * FROM topic`, (err, topics) => {
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
        conn.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id = author.id WHERE topic.id=?`,[queryData.id], (err2, topic) => { 
          if(err2) {
            throw err2;
          }
          const title = topic[0].title;
          const description = topic[0].description;
          const list = template.list(topics);
          const html = template.html(
                  title,
                  list,
                  `<h2>${title}</h2><article><p>${description}</p>by ${topic[0].name}</article>`,
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
    conn.query(`SELECT * FROM topic`, (err, topics) => {
      conn.query(`SELECT * FROM author`, (err, authors) => {
        const list = template.list(topics);
        const title = 'Create';
        const html = template.html(title,
                list,
                `
                <form action="/create_process" method="POST">
                  <p><input placeholder="title" type="input" name="title"/></p>
                  <p><textarea placeholder="description" name="description" rows=8></textarea></p>
                  <p>${template.authorSelect(authors)}</p>
                  <p><input type="submit"/></p>
                </form>
                `,
                ''
              );
        response.writeHead(200);
        response.end(html);
      })
    })
  }
  else if (pathName === '/create_process') {
    let body = '';
    request.on('data', (data) => {
      body += data;
    });
    request.on('end', () => {
      const post = qs.parse(body);
      conn.query(`INSERT INTO topic (title, description, created, author_id) VALUES(?, ?, NOW(), ?)`,
      [post.title, post.description, post.author],
       (err, result) => {
         if (err) {
           throw err;
         } else {
           response.writeHead(302, {location: `/?id=${result.insertId}`});
           response.end();
         }
      });
    });
  }
  else if (pathName === '/update'){
    conn.query(`SELECT * FROM topic`, (err, topics) => {
      if (err) {
        throw err;
      }
      conn.query(`SELECT * FROM topic WHERE id=?`,[queryData.id], (err2, topic) => {
        if (err2) {
          throw err2;
        }
        conn.query(`SELECT * FROM author`, (err3, authors) => {
          if (err3) {
            throw err3;
          }
          const list = template.list(topics);
          const title = 'Update';
          const html = template.html(title,
              list,
              `
              <form action="/update_process?id=${queryData.id}" method="POST">
                <input type="hidden" name="id" value="${queryData.id}"/>
                <p><input placeholder="title" type="input" name="title" value="${topic[0].title}"/></p>
                <p><textarea placeholder="description" name="description" rows=8>${topic[0].description}</textarea></p>
                <p>${template.authorSelect(authors)}</p>
                <p><input type="submit"/></p>
              </form>
              `,
              `<a href="/create">Create</a> <a href="/update?id=${queryData.id}">Update</a>`,
              );
            response.writeHead(200);
            response.end(html);
        });
      });
    });
  }
  else if (pathName === '/update_process'){
    let body = '';
    request.on('data', (data) => {
      body += data;
    });
    request.on('end', () => {
      const post = qs.parse(body);
      conn.query(`UPDATE topic SET title=?, description=?, author_id=? WHERE id=?`,
      [post.title, post.description, post.author, queryData.id],
       (err, results) => {
         if (err) {
           throw err;
         } else {
           response.writeHead(302, {location: `/?id=${queryData.id}`});
           response.end();
         }
      });
    });
  }
  else if (pathName === '/delete_process'){
    let body = '';
    request.on('data', (data) => {
      body += data;
    });
    request.on('end', () => {
      const post = qs.parse(body);
      conn.query(`DELETE FROM topic WHERE id=?`,
      [post.id],
       (err, results) => {
         if (err) {
           throw err;
         } else {
           response.writeHead(302, {location: `/`});
           response.end();
         }
      });
    });
  } else {
    response.writeHead(404);
    response.end('404 not found');
  }
});
app.listen(3000);