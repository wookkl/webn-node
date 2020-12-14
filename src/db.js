const db = require('mysql').createConnection({
    host     : 'localhost',
    user     : 'nodejs',
    password : '1111',
    database : 'wookkl'
  });
db.connect()
module.exports = db;        