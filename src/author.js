const url = require("url");
const qs = require("querystring");
const sanitizedHtml = require("sanitize-html")
const db = require("./db");
const template = require("./template");
exports.detail = (request, response) => {
    db.query('SELECT * FROM topic', (err1, topics) => {
        if(err1) {
            throw err1;
          }
        db.query('SELECT * FROM author', (err2, authors) => {
            if(err2) {
                throw err2;
            }
            const title = "Author";
            const list = template.list(topics);
            const authorTable = template.authorTable(authors);
            const html = template.html(
                    title,
                    list,
                    `
                    <form action="/author/create_process" method="POST">
                        <p><input placeholder="name" type="input" name="name"/></p>
                        <p><textarea placeholder="profile" name="profile" rows=2></textarea></p>
                        <p><input type="submit" value="create"/></p>
                    </form>
                    `,
                    authorTable,
                    );
            response.writeHead(200);
            response.end(html);
        });
    });
};

exports.create_process = (request, response) => {
    let body = '';
    request.on('data', (data) => {
      body += data;
    });
    request.on('end', () => {
        const post = qs.parse(body);
        db.query(`INSERT INTO author (name, profile) VALUES(?, ?)`,
        [post.name, post.profile],
         (err, result) => {
           if (err) {
             throw err;
           } else {
             response.writeHead(302, {location: '/author'});
             response.end();
           }
        });
    });
};

exports.update = (request, response) => {
    const _url = request.url;
    const queryData = url.parse(_url, true).query;
    db.query(`SELECT * FROM topic`, (err1, topics) => {
        if (err1) { throw err1; }
        db.query("SELECT * FROM author WHERE id=?",[queryData.id], (err2, author) => {
            if (err2) { throw err2; }
            const list = template.list(topics);
            const title = 'Update Author';
            const html = template.html(title,
                list,
                `
                <h4>Update Author</h4>
                <form action="/author/update_process" method="POST">
                    <input type="hidden" name="id" value="${queryData.id}"/>
                    <p><input placeholder="name" type="input" name="name" value="${sanitizedHtml(author[0].name)}"/></p>
                    <p><textarea placeholder="profile" name="profile" rows=2>${sanitizedHtml(author[0].profile)}</textarea></p>
                    <p><input type="submit" value="update"/></p>
                </form>
                `,
                ``,
                );
            response.writeHead(200);
            response.end(html);
        });
    });
};

exports.update_process = (request, response) => {
    let body = '';
    request.on('data', (data) => {
      body += data;
    });
    request.on('end', () => {
        const post = qs.parse(body);
        db.query(`UPDATE author SET name=?, profile=? WHERE id=? `,
        [post.name, post.profile, post.id],
         (err, result) => {
           if (err) {
             throw err;
           } else {
             response.writeHead(302, {location: '/author'});
             response.end();
           }
        });
    });
};

exports.delete_process = (request, response) => {
    let body = '';
    request.on('data', (data) => {
      body += data;
    });

    request.on('end', () => {
        const post = qs.parse(body);
        db.query(`DELETE FROM author WHERE id=? `,
        [post.id],
         (err, result) => { 
           if (err) {
             throw err;
           } else {
             response.writeHead(302, {location: '/author'});
             response.end();
           }
        });
    });
};