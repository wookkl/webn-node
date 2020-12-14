const sanitizeHtml = require("sanitize-html");

module.exports = {
    html: (title, list, body, control) => {
      return `
        <!doctype html>
        <html>
          <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
            <style>
              table, th, td {
                border: 1px solid #444444;
              } 
              th, td {
                padding: 5px;
              }
            </style>
          </head>
          <body>
            <h1><a href="/">WEB</a></h1>
            <h3><a href="/author">author</a></h3>
            <h3>Topics</h3
            <ul>
              ${list}
            </ul>
            ${control}
            ${body}
          </body>
        </html>
        `;
    },
    list: (topics) => {
      let li = '';
      topics.forEach(topic => {
        li += `<li><a href="/?id=${topic.id}">${sanitizeHtml(topic.title)}</a></li>`
      });
      return li;
    },
    authorSelect: (authors, author_id) => {
      console.log(author_id);
      let select = '';
        select+='<select name="author">';
        authors.forEach(author => {
          let selected='';
          select += `<option value="${author.id}" ${selected}>${sanitizeHtml(author.name)}</option>`
        });
        select+='</select>';
        return select;
    },
    authorTable: (authors) => {
      let table = `
                    <h1>Author Table</h1>
                    <table><thead>
                    <tr><th>Name</th>
                    <th>Profile</th>
                    <th>Update</th>
                    <th>Delete</th></tr>
                    </thead><tbody>
                  `;
      authors.forEach((author) => {
        table += `
                <tr>
                  <td>${sanitizeHtml(author.name)}</td>
                  <td>${sanitizeHtml(author.profile)}</td>
                  <td><a href="/author/update?id=${author.id}">update</a></td>
                  <td><form action="/author/delete_process" method="POST">
                    <input type="hidden" name="id" value="${author.id}"/>
                    <input type="submit" value="delete"/>
                  </form></td>
                </tr>
                `;
      });
    table+=`</tbody></table>`;
    return table;
    }
  }