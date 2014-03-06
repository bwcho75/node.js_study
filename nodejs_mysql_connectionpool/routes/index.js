
/*
 * GET home page.
 */
var mysql = require('mysql');
var pool  = mysql.createPool({
    host     : 'localhost',
    user     : 'terry',
    password : 'asdf1234',
    database :'terry'
});

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.users = function(req,res){
    pool.query('select * from users',function(err,rows,fields){
        console.log(rows);
        //console.log(fields);
        console.log('pid :'+process.pid );
        res.json(rows);
    });

};
