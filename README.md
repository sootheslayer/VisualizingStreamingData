# Real time data visualization

Proof of Concept (PoC) for the reporting layer in the [lambda architecture](https://en.wikipedia.org/wiki/Lambda_architecture).

Technology Stack
 - Lambda architecture
  - [Kafka](https://kafka.apache.org/)
  - [Spark Streaming](http://spark.apache.org/streaming/)
  - [Spark](http://spark.apache.org/)
  - [Cassandra](http://cassandra.apache.org/)
 - Reporting Layer
  - [Node](https://nodejs.org/en/)
  - [Express](https://expressjs.com/)
  - [Socket.io](http://socket.io/)
  - [Kafka-Node](https://www.npmjs.com/package/kafka-node)
  - [Cassandra Driver for Node](https://www.npmjs.com/package/cassandra-driver)
  - [MaterializeCSS](http://materializecss.com/)
  - [D3](https://d3js.org/)
  - [NVD3](http://nvd3.org/)
  - [jQuery](https://jquery.com/)

## Introduction

Data source in this PoC was web server logs. Web server logs were generated using a data simulator built indigenously. Each row of the logs were arriving as messages in [Kafka](https://kafka.apache.org/). The real time data was directly consumed by reporting layer from Kafka. Near real time data was consumed by spark streaming, processing the data (sliding window) operation and the processed data was written into another Kafka topic to which the reporting layer was listening to. Spark streaming, simultaneously was offloading all of the data into Cassandra. And batch jobs were triggered after set intervals and insights driven from those batch jobs were written into separate Cassandra tables. Reporting layer was pulling the data from the tables with a refresh button.

### Roles of different technologies

- [Kafka](https://kafka.apache.org/) - Fault tolerant, persistent pub/sub messaging service
- [Spark Streaming](http://spark.apache.org/streaming/) - Stream processor
- [Spark](http://spark.apache.org/) - Batch processing
- [Cassandra](http://cassandra.apache.org/) - No SQL database
- [Node](https://nodejs.org/en/) - Reporting layer application container
- [Express](https://expressjs.com/) - Web application routing
- [Socket.io](http://socket.io/) - High level API implementing web sockets
- [Kafka-Node](https://www.npmjs.com/package/kafka-node) - Kafka driver for Node.js
- [Cassandra Driver for Node](https://www.npmjs.com/package/cassandra-driver) - Cassandra driver for Cassandra
- [MaterializeCSS](http://materializecss.com/) - UI for web app
- [D3](https://d3js.org/) - JS library for manipulating html document with data
- [NVD3](http://nvd3.org/) - Charting library built on D3
- [jQuery](https://jquery.com/) - library for manipulating html documents

### The Dashboard
The final dashboard looks like this.

This one is for the real time data. The charts are updating at a interval of 1 sec.
![Real Time Dashboard](https://github.com/hchowdhary/Portfolio/tree/gh-pages/images/clickstream-real-time.png)

And this is how the dashboard for batch queries looks like.
![Batch Dashboard](https://github.com/hchowdhary/Portfolio/tree/gh-pages/images/clickstream-historical.png)

## Node application setup

`app.js` and `public/javascripts/main.js` are the heart of this application. Node application container configurations are defined in `app.js` and client (browser) side configurations and chart definitions are defined in `main.js`. Other two important files are `index.html` and `historical.html` which contains the definition of UI.
Let's look at these files.

### Node container definitions and configurations
First and foremost let's import all the modules into our project.

```javascript
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var kafka = require('kafka-node');
var cassandra = require('cassandra-driver');
```

Importing all the dependencies here. It is very important to note that socket.io instance is attached to the http server created above.

Defining the port on which the app should be running on our machine

```javascript
server.listen(3000);
```

### Route definitions.

```javascript

app.use(express.static(__dirname + '/public'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/historical', function (req, res) {
  res.sendFile(__dirname + '/public/historical.html');
});
```

This was the basic web app scaffolding.

### Kafka consumer configuration.

```javascript
var zkserver = 'localhost:2181'; // Kafka Server Address
var kafka_client_id = 'reporting-layer';
var kafkaClient = new kafka.Client(zkserver,kafka_client_id);
var consumer = new kafka.Consumer(kafkaClient,[{ topic: 'bounceRate' },{ topic: 'averageTime' },{ topic: 'usersPerCategory' },{ topic: 'hitsByMarketingChannels' },{ topic: 'pagesByBounceRate' }],{autoCommit: true});
```

`zkserver` variable holds the address of the zookeeper server. `kafka-client-id` is just a name to identify itself at the kafka broker. `kafkaClient` variable holds the kafka client instance and instructs the consumer to connect to zookeeper server defined by `zkserver`. In the next line we are creating a instance of kafka consumer on kafkaClient and to listen to messages on specified topics. To remove or add the topics to listen to append or remove `{topic: 'topic-to-be-removed-or-added'}`.

Instantiate and initialize cassandra driver.

```javascript
var client = new cassandra.Client({contactPoints: ['localhost'], keyspace: 'rajsarka'});
```
Defining the cassandra server address in `contactPoints` property and deifine the keyspace to use in `keyspace` property.
Make sure that your cassandra server allows connection from outside. Check for relevant properties in config.yaml of cassandra server.

Now, we have instantiated all necessary modules and drivers, let's now define event handlers for kafka and socket.io.

### Socket.io event handler definitions

```javascript
io.on('connection', function (socket) {
	console.log("A client is connected.");

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
});
```

Okay that's huge chunk of code at once. Sorry for being blunt and exposing so many lines at once. Let's break it down.

```javascript
io.on('connection', function (socket) {
	console.log("A client is connected.");
});
```

This piece of code defines the actions to take as soon as a websocket connection is established between the server and client. Sorta like a handshake. Here we are just logging on the console that a client is connected. This also defines passes on socket instance to the inner function to transmit any data to the client to the client. In short, it defines the tunnel to use the data to a specific client.
Now, using this `socket` we'll be sending and receiving data to and from client. 

WebSockets also work more or less like pub/sub messaging services. A message is published to topic and all the clients listening to that topics get the message. We have defined a bunch of actions to take when a message arrives on a particular topic. The above event handler receives a query as a message from client and it executes that query on cassandra with `client.execute(query, function (err, result)` which returns error if any error occurred while fetching results else gives back the result in nicely formatted JSON. Now we have just a bunch of data transformation process going on.

The result of the query that is returned is formatted this way.

```json
{
	"rows": [
		{"user": "smith", "email" : "smith@sam.com"},
		{"user": "doe", "email" : "doe@john.com"}
	]
}
```

The fetched result has a property called `rows` which contains an array of objects which are have the property values same as column names. 

```javascript
result.rows.forEach(function(row){
				chartData[0].values.push({x: row.c.get(0), y: row.c.get(1)});				
			});
```

For each object in the array we are pushing data into the processed data that we need to send back to client. In our cassandra table we used tuples inside a column to store some of the values, so to get the value out from those tuple we use `row.c.get(0)` where `0` indicates the position of values in tuple. 

Lastly, we send back the processed data using 

```javascript
io.emit('fetched-conversionSummaryChartData', consolidatedArr); 
```

This line *emits* data to the client connected using the websocket listening to messages on topic *fetched-conversionSummaryChartData*.

### Kafka consumer action definition.

```javascript
consumer.on('message', function (message) {
	io.emit(message.topic, message.value);
});
```
This code snippet defines what action to take as soon as a message arrives on any of the kafka topics to which this instantiated consumer is listening to. Kafka `message` is interpreted by *kafka-node* as a JSON object which has a property called topic and value. So what second line does is it sends the kafka message value to the client listening to the websocket connection on `message.topic`.

## Client side JS

Client side JS does only three jobs
 - listens to websocket connections
 - renders chart
 - updates chart

#### Initialize socket.io connection 

Replace localhost with the address of your web server.

```javascript
var socket = io.connect('http://localhost:3000');
```

#### Chart definitions

Charts are built using a charting library built on top of D3 called NVD3. It comes with most of the charts out of the box which are customizable to some extent (cons of using pre-defined libraries). NVD3 is like [Bootstrap](http://getbootstrap.com/) of Data visualization for the web. Enough said let's get back to our code.

The scatter plot chart definition.

```javascript
nv.addGraph(function() {
    conversionScatterChart = nv.models.scatterChart()
        .margin({right: 40})
        .showDistX(true)
        .showDistY(true)
        .showLabels(true)
        .useVoronoi(true)
        .color(d3.scale.category10().range())
        .duration(300)
        .clipEdge(true)
    ;
    conversionScatterChart.dispatch.on('renderEnd', function(){
        console.log('render complete');
    });

    conversionScatterChart.xAxis
    			.axisLabel('Time Spent (in mins)')
    			.tickFormat(d3.format('.02f'));
    
    conversionScatterChart.yAxis
    			.axisLabel('Total Visits')
					.tickFormat(d3.format('.02f'));

    d3.select('#conversionSummaryChart')
    		.append('svg')
        .datum(conversionScatterChartData)
        .transition().duration(1000)
        .call(conversionScatterChart);

    nv.utils.windowResize(conversionScatterChart.update);

    conversionScatterChart.dispatch.on('stateChange', function(e) { ('New State:', JSON.stringify(e)); });
    return conversionScatterChart;
});
```

As you can see it gives you a lot of options to play with while configuring your chart and then it finally uses d3 to append the chart to a DOM. Well since  it is a predefined library it accepts the data in certain format. The scatter plot data looks like:

```javascript
var conversionScatterChartData = [
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
		key: "Umbrella",
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
```
It has more properties than I used over here. Each object in this array has a property of `size`,`shape` and `color` which can be configured, but here I am just good with the defaults.

#### jQuery triggers

I am using jQuery here but the same result can also be achieved using d3 even, but I just went ahead with jQuery. There are some places like dom manipulation, dom events, dom animation where jQuery and d3 overlap. 

I am using jQuery here to watch for button clicks and then update chart data.

```javascript
$("#refreshConversionSummaryData").click(function(){
	updateConversionSummaryChart("SELECT * FROM scatter_plot_table limit 100 ;");
});
```

#### Functions to update data

This is the piece of code responsible for updating data.

```javascript
var updateEcrChart = function(query){
	startTime = Date.now();
	console.log('sending query to update ecrChart server: ' + query);
	socket.emit('fetch-ecrChartData', query);
};

socket.on('fetched-ecrChartData',function(data){
	ecrChartData[0].values = data[0];
	ecrChartData[1].values = data[1];
	ecrChartData[2].values = data[2];
	ecrChart.update();
	ecrModalChart.update();
	console.log(`Time taken to update ecrChart is ${Date.now()-startTime} milliseconds.`);
	queryLatencyChartData[0].values.push({x:count++,y:(Date.now()-startTime)});
	queryLatencyChart.update();
});
```

The update chart function is called by jQuery which is triggered by the button click. Update function sends the query to client using the websockets. and the second piece of code describes the actions describes the how to update chart values with the data received from websocket from server.

## Conclusion

The objective of this PoC was to study the latency of this architecture for any message to reach from origin to end. And the results found out were as follows.

 - Realtime : 100 to 150 milliseconds
 - Near Realtime : 300 to 400 milliseconds
 - Batch Query Latency (time to fetch queries from cassandra): 700 to 800 milliseconds.

