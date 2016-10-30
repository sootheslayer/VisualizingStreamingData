var express = require('express');
var app = express();
var server = require('http').Server(app); 
var io = require('socket.io')(server); // attach socket.io to the server
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
var zkserver = 'localhost:2181'; // Kafka Server Address
var kafka_client_id = 'reporting-layer';
var kafkaClient = new kafka.Client(zkserver,kafka_client_id);
var consumer = new kafka.Consumer(kafkaClient,[{ topic: 'bounceRate' },{ topic: 'averageTime' },{ topic: 'usersPerCategory' },{ topic: 'hitsByMarketingChannels' },{ topic: 'pagesByBounceRate' }],{autoCommit: true});

//cassandra configurations
var client = new cassandra.Client({contactPoints: ['localhost'], keyspace: 'rajsarka'});

// Define action to take when a websocket connection is established
io.on('connection', function (socket) {
	console.log("A client is connected.");

	//fetch conversion summary data from cassandra
	socket.on('fetch-conversionSummaryChartData',function(query){
		client.execute(query, function (err, result) {
			if(err){
				console.log(err);
			}
			console.log('executing query: ' + query);
			console.log('processing data');
			// Data processing
			var chartData = [
				{
					key: "Condo",
					values: []
				},
				{
					key: "Vehicle",
					values: []
				},
				{
					key: "Home Owner",
					values: []
				},
				{
					key: "Renters",
					values: []
				},
				{
					key: "Flood",
					values: []
				}
			];
			
			result.rows.forEach(function(row){
				chartData[0].values.push({x: row.c.get(0), y: row.c.get(1)});
				chartData[1].values.push({x: row.v.get(0), y: row.v.get(1)});
				chartData[2].values.push({x: row.h.get(0), y: row.h.get(1)});
				chartData[3].values.push({x: row.r.get(0), y: row.r.get(1)});
				chartData[4].values.push({x: row.f.get(0), y: row.f.get(1)});
				
			});
			var consolidatedArr = [chartData[0].values, chartData[1].values, chartData[2].values, chartData[3].values, chartData[4].values];
			console.log('sending data to conversionSummaryChartData');
			io.emit('fetched-conversionSummaryChartData', consolidatedArr); // send data to client
		});
	});

	// fetch USER MAPS data from cassandra
	socket.on('fetch-latLong', function(query){
		client.execute(query, function(err, result){
			if (err) { console.log(err)};
			console.log('executing query: ' + query);
			io.emit('fetched-latLongData', result.rows);
		});
	});

	// fetch ECR data from cassandra
	socket.on('fetch-ecrChartData',function(query){
		client.execute(query, function (err, result) {
			if(err){
				console.log(err);
			}
			console.log('executing query: ' + query);
			console.log('processing data');
			// Data processing
			var chartData = [
				    {
				        key: 'Engagement',
				        values: [
				            {
				                "label" : "Vehicle" ,
				                "value" : 0
				            } ,
				            {
				                "label" : "Condo" ,
				                "value" : 0
				            } ,
				            {
				                "label" : "Home Owner" ,
				                "value" : 0
				            } ,
				            {
				                "label" : "Renters" ,
				                "value" : 0
				            } ,
				            {
				                "label" : "Flood" ,
				                "value" : 0
				            } ,
				            {
				                "label" : "Others" ,
				                "value" : 0
				            }
				        ]
				    },
				    {
				        key: 'Conversion',
				        values: [
				            {
				                "label" : "Vehicle" ,
				                "value" : 0
				            } ,
				            {
				                "label" : "Condo" ,
				                "value" : 0
				            } ,
				            {
				                "label" : "Home Owner" ,
				                "value" : 0
				            } ,
				            {
				                "label" : "Renters" ,
				                "value" : 0
				            } ,
				            {
				                "label" : "Flood" ,
				                "value" : 0
				            } ,
				            {
				                "label" : "Others" ,
				                "value" : 0
				            }
				        ]
				    },
				    {
				        key: 'Retention',
				        values: [
				            {
				                "label" : "Vehicle" ,
				                "value" : 0
				            } ,
				            {
				                "label" : "Condo" ,
				                "value" : 0
				            } ,
				            {
				                "label" : "Home Owner" ,
				                "value" : 0
				            } ,
				            {
				                "label" : "Renters" ,
				                "value" : 0
				            } ,
				            {
				                "label" : "Flood" ,
				                "value" : 0
				            } ,
				            {
				                "label" : "Others" ,
				                "value" : 0
				            }
				        ]
				    }
			];
			result.rows.forEach(function(row){
					// Conversion values for each insurance
					chartData[1].values[0].value += row.c_v.get(1);
					chartData[1].values[1].value += row.c_c.get(1); 
					chartData[1].values[2].value += row.c_h.get(1);
					chartData[1].values[3].value += row.c_r.get(1); 
					chartData[1].values[4].value += row.c_f.get(1);

					// engagement values for each insurance
					chartData[0].values[0].value += row.e_v.get(1);
					chartData[0].values[1].value += row.e_c.get(1); 
					chartData[0].values[2].value += row.e_h.get(1);
					chartData[0].values[3].value += row.e_r.get(1); 
					chartData[0].values[4].value += row.e_f.get(1);
					chartData[0].values[5].value += row.e_o.get(1);

					// retention values for each insurance
					chartData[2].values[0].value += row.r_v.get(1);
					chartData[2].values[1].value += row.r_c.get(1); 
					chartData[2].values[2].value += row.r_h.get(1);
					chartData[2].values[3].value += row.r_r.get(1); 
					chartData[2].values[4].value += row.r_f.get(1);
			});
			// send the updated arrays to client
			chartData[0].values.forEach(function(obj){
				obj.value = Math.log10(obj.value);
			});
			chartData[1].values.forEach(function(obj){
				obj.value = Math.log10(obj.value);
			});
			chartData[2].values.forEach(function(obj){
				obj.value = Math.log10(obj.value);
			});
			var consolidatedArr = [chartData[0].values, chartData[1].values, chartData[2].values];
			io.emit('fetched-ecrChartData', consolidatedArr); 
		});
	});


});

// Kafka consumer action definitions
consumer.on('message', function (message) {
	// console.log(message.topic + " ->> " + message.value);
	io.emit(message.topic, message.value); // Reading Kafka topic value and Kafka message
});