module.exports = {
    html: (title, li, body, control) => {
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
    }
  }