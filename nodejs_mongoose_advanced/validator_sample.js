/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var mongoose = require('mongoose');

// define validator
function NameAlphabeticValidator(val){
    return val.match("^[a-zA-Z\(\)]+$");
}
function MemoLengthValidator(val){
    if(val.length>10) return null;
    return val;
}

// schema definition with validation
var MemoSchema= mongoose.Schema({
                    username:{type:String,validate:NameAlphabeticValidator}
                    ,memo:{type:String,validate:[
                                    {validator:MemoLengthValidator,msg:'memo length should be less than 10'},
                                    {validator:NameAlphabeticValidator,msg:'PATH `{PATH}` should be alphabet only. Current value is `{VALUE}` '}
                                    ]}
    });
var Memo = mongoose.model('MemoModel',MemoSchema); // MemoModel : mongodb collection name

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.post('/insert', function(req,res,err){
    var memo = new Memo({username:req.body.username,memo:req.body.memo});
    memo.save(function(err,silence){
        if(err){
            console.error(err);
            res.send(500,'error');
        }
        res.send('success');
    });
});

app.get('/users/:username', function(req,res,err){
    var memos = new Memo();
    Memo.findOne({'username':req.params.username},function(err,memo){
        if(err){
            console.err(err);
            throw err;
        }
        console.log(memo);
        res.send(200,memo);
    });
});
app.get('/users', function(req,res,err){
    var memos = new Memo();
    Memo.find().select('username').exec(function(err,memos){
        if(err){
            console.err(err);
            throw err;
        }
        console.log(memos);
        res.send(memos);
    });
});

mongoose.connect('mongodb://localhost/terrydb',function(err){
    if(err){
        console.log('mongoose connection error :'+err);
        throw err;
    }
    http.createServer(app).listen(app.get('port'), function(){
        console.log('Express server listening on port ' + app.get('port'));
    });
});
