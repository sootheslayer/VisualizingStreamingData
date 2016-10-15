var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var kafka = require('kafka-node');

server.listen(3000);

app.use(express.static(__dirname + '/public'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

// Kafka Consumer Config
var zkserver = 'localhost:2181'; // Kafka Server Address
var kafka_client_id = 'socket.io-kafka';
var kafkaClient = new kafka.Client(zkserver,kafka_client_id);
var consumer = new kafka.Consumer(kafkaClient,[{ topic: 'bounceRate' },{ topic: 'averageTime' },{ topic: 'usersPerCategory' },{ topic: 'hitsByMarketingChannels' },{ topic: 'pagesByBounceRate' }],{autoCommit: true});

// Define action to take when a websocket connection is established
io.on('connection', function (socket) {
	console.log("A client just connected."); 
});

// Kafka consumer action definitions
consumer.on('message', function (message) {
	// console.log(message.topic + " ->> " + message.value);
	io.emit(message.topic, message.value); // Reading Kafka topic value and Kafka message
});