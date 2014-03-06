
/*
 * GET home page.
 */
var mysql = require('mysql');

var connection = mysql.createConnection({
    host    :'localhost',
    port : 3306,
    user : 'terry',
    password : 'asdf1234',
    database:'terry'
})
exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.users = function(req,res){
    connection.query('select * from users',function(err,rows){
        console.log(rows);
        res.json(rows);
    });
}