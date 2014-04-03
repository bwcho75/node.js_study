
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

var app = express();
var MongoClient = require('mongodb').MongoClient
    , Server = require('mongodb').Server;

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

var mongoclient = new MongoClient(new Server('localhost',27017,{'native_parser':true}));
var db = mongoclient.db('test');

app.get('/', function(req,res) {
   db.collection('users').findOne({},function(err,doc){
       if(err) throw err;
       res.send(doc);
   });
});

mongoclient.open(function(err, mongoclient) {
    if(err) throw err;
    console.log('mongo client connected');
    http.createServer(app).listen(app.get('port'), function(){
        console.log('Express server listening on port ' + app.get('port'));
    });

});
