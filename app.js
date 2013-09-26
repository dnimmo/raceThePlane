// ===================
// Module dependencies
// ===================

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var twitter = require('twitter');
var util = require('util');
var db = require('mongojs').connect('localhost/race', ['tweets']);
var tweetsCollection = db.collection('tweets');
var twit = new twitter({
	consumer_key: 'kXxGBhM5vQJBBxUbhBuWg',
	consumer_secret: 'pWmOdwdYc4rKEbr5NqXbk10CM2phW8HmnPqdkyUVDM',
	access_token_key: '74781079-O7RSMeDm0n8dqZNaAhoFF6iiXKmJFJc1naAOdbfDM',
	access_token_secret: 'NgmGTGWCyMQBHmf56KYrkITUfrwGYdYKAKnDisWHTo'
});
var tweets = [];
var tweetCount;
var miles = 0;

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

// All environments
app.set('port', process.env.PORT || 9000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

// Serve assets from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


//If server is restarted, initialise count and tweets
countTweets();
findTweets();

// =====================
// Database interactions
// =====================

//Function add a user to the database
function addTweet(data){
	tweetsCollection.insert(data, function(err){
		if(err){
			console.log("Error updating: "+err);
		}
	});
}

function countTweets(){
	tweetsCollection.count(function(err, count){
		if(err){
			console.log("Error: "+err);
		} else {
			tweetCount = count;
		}
	});
};

function findTweets(){
	tweetsCollection.find(function(err, data){
		if(err){
			console.log("Error: "+err);
		} else {
			tweets = data;
		}
	});
};

// ======================
// Socket.io interactions
// ======================

//Twitter - search for #RaceThePlane
twit.stream('statuses/filter', {track: 'flight'}, function(stream){
	io.sockets.on('connection', function(socket){
		console.log("Connection " + socket.id + " accepted.");
		stream.on('data', function(data){
			addTweet(data);
			tweetCount++;
			socket.emit('tweet', data, tweetCount);
		});
	});
});