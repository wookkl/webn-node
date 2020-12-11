module.exports =  {
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
    list: (files) => {
      let li = '';
      files.forEach(file => {
        li += `<li><a href="/?id=${file}">${file}</a></li>`
      });
      return li;
    }
  }