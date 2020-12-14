module.exports = {
    html: (title, li, body, control) => {
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
              ${li}
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
        li += `<li><a href="/?id=${topic.id}">${topic.title}</a></li>`
      });
      return li;
    },
    authorSelect: (authors) => {
      let select = '';
        select+='<select name="author">';
        authors.forEach(author => {
          select += `<option value="${author.id}">${author.name}</option>`
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
                  <td>${author.name}</td>
                  <td>${author.profile}</td>
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