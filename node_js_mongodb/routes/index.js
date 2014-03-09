
/*
 * GET home page.
 */
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error',console.error.bind(console,'mongoose connection error'));
db.once('open', function callback(){
    console.log('mongodb has been connected');
});
var memoScheme  = new mongoose.Schema({author:String,contents:String,date:Date});
var memoModel = mongoose.model('Memo',memoScheme);

exports.index = function(req, res){
    res.render('index', { title: 'Express' });
};
exports.memos = function(req,res){
    memoModel.find({},function(err,data){
        res.json(data);
    });
}
exports.writeMemo = function(req,res){
    var author = req.body.author;
    var contents = req.body.contents;
    var date = Date.now();

    var memo = new memoModel();
    memo.author = author;
    memo.contents = contents;
    memo.date = date;

    memo.save(function(err){
        if(err){
            console.log(err);
            throw err;
        }else{
            res.json({status:'SUCCESS'});
        }
    });
};