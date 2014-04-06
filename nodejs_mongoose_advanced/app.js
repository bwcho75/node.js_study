
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var mongoose = require('mongoose');

var MemoSchema= mongoose.Schema({username:String,memo:String});
var Memo = mongoose.model('Memo',MemoSchema);

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.post('/insert', function(req,res,err){
    var memo = new Memo({username:req.body.username,memo:req.body.memo});
    memo.save(function(err,silence){
        if(err) return console.error(err);
    });
    res.send('success');
});

app.get('/query', function(req,res,err){
    var silence = new Kitten({name:'Silence'});
    silence.save(function(err,silence){
        if(err) return console.error(err);
    });
    response.send('success');
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