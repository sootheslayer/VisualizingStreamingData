var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var kafka = require('kafka-node');
var cassandra = require('cassandra-driver');

server.listen(3000);

app.use(express.static(__dirname + '/public'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/historical', function (req, res) {
  res.sendFile(__dirname + '/public/historical.html');
});

// Kafka Consumer Config
var zkserver = 'din16000309:2181'; // Kafka Server Address
var kafka_client_id = 'socket.io-kafka';
var kafkaClient = new kafka.Client(zkserver,kafka_client_id);
var consumer = new kafka.Consumer(kafkaClient,[{ topic: 'bounceRate' },{ topic: 'averageTime' },{ topic: 'usersPerCategory' },{ topic: 'hitsByMarketingChannels' },{ topic: 'pagesByBounceRate' }],{autoCommit: true});

//cassandra configurations
var client = new cassandra.Client({contactPoints: ['DIN16000309'], keyspace: 'rajsarka'});

// Define action to take when a websocket connection is established
io.on('connection', function (socket) {
	console.log("A client is connected.");

	//fetch data from cassandra
	socket.on('fetch-conversionSummaryChartData',function(query){
		client.execute(query, function (err, result) {
			if(err){
				console.log(err);
			}
			console.log('executing query: ' + query);
			io.emit('fetched-conversionSummaryChartData', result.rows); // send data to client
		});
	});
});

// Kafka consumer action definitions
consumer.on('message', function (message) {
	// console.log(message.topic + " ->> " + message.value);
	io.emit(message.topic, message.value); // Reading Kafka topic value and Kafka message
});