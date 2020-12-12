var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'nodejs',
  password : '1111',
  database : 'wookkl'
});
 
connection.connect();
 
connection.query('SELECT * FROM topic;', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results);
});
 
connection.end();