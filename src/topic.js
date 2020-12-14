const qs = require('querystring');
const url = require('url'); 
const db = require("./db");
const template = require('./template');

exports.home = (request, response) => {
    db.query(`SELECT * FROM topic`, (err, topics) => {
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
    });
}

exports.detail = (request, response) => {
    const _url = request.url;
    const queryData = url.parse(_url, true).query;
    db.query('SELECT * FROM topic', (err, topics) => {
        if(err) {
          throw err;
        }
        db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id = author.id WHERE topic.id=?`,[queryData.id], (err2, topic) => { 
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

exports.create = (request, response) => {
     db.query(`SELECT * FROM topic`, (err, topics) => {
        db.query(`SELECT * FROM author`, (err, authors) => {
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
        });
    });
}

exports.create_process = (request, response) => {
    let body = '';
    request.on('data', (data) => {
      body += data;
    });
    request.on('end', () => {
      const post = qs.parse(body);
      db.query(`INSERT INTO topic (title, description, created, author_id) VALUES(?, ?, NOW(), ?)`,
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

exports.update = (request, response) => {
    const _url = request.url;
    const queryData = url.parse(_url, true).query;
    db.query(`SELECT * FROM topic`, (err, topics) => {
        if (err) {
        throw err;
        }
        db.query(`SELECT * FROM topic WHERE id=?`,[queryData.id], (err2, topic) => {
            if (err2) {
                throw err2;
            }
            db.query(`SELECT * FROM author`, (err3, authors) => {
                if (err3) {
                throw err3;
                }
                const list = template.list(topics);
                const title = 'Update Topic';
                const html = template.html(title,
                    list,
                    `
                    <form action="/update_process?id=${queryData.id}" method="POST">
                    <input type="hidden" name="id" value="${queryData.id}"/>
                    <p><input placeholder="title" type="input" name="title" value="${topic[0].title}"/></p>
                    <p><textarea placeholder="description" name="description" rows=8>${topic[0].description}</textarea></p>
                    <p>${template.authorSelect(authors)}</p>
                    <p><input type="submit" value="update"/></p>
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

exports.update_process = (request, response) => {
    const _url = request.url;
    const queryData = url.parse(_url, true).query;
    let body = '';
    request.on('data', (data) => {
      body += data;
    });
    request.on('end', () => {
      const post = qs.parse(body);
      db.query(`UPDATE topic SET title=?, description=?, author_id=? WHERE id=?`,
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

exports.delete_process = (request, response) => {
    let body = '';
    request.on('data', (data) => {
        body += data;
    });
    request.on('end', () => {
        const post = qs.parse(body);
        db.query(`DELETE FROM topic WHERE id=?`,
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
    }