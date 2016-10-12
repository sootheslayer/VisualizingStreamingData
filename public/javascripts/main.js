// Initialize websocket connection
var socket = io.connect('http://localhost:3000');

//Socket event handlers
socket.on('bounceRate', function (data) {
	chart1.push(data);
});
socket.on('test2', function (data) {
	chart2.push(data);
});

// Create charts

// var data = new RealTimeData(2);

// var lineChartData = [{
// 	label: "randomVal",
// 	values: data.history()
// }];

// var chart = $('#lineChart').epoch({
// 	type: 'time.line',
// 	data: lineChartData,
// 	axes: ['bottom', 'left']
// });

// setInterval(function() { chart.push(data.next()); }, 100);
// chart.push(data.next());

var chart1Data = [{
	label: "test1",
	values: [{time:1476272058,y:68},
			{time:1476272058,y:69},
			{time:1476272058,y:62},
			{time:1476272058,y:59},
			{time:1476272058,y:88},
			{time:1476272058,y:48},
			{time:1476272058,y:22},
			{time:1476272058,y:88},
			{time:1476272058,y:36},
			{time:1476272058,y:69}]
}];

var chart1 = $('#lineChart1').epoch({
	type: 'time.line',
	data: chart1Data,
	axes: ['bottom', 'left']
});

var chart2Data = [{
	label: "test1",
	values: [{time:1476272058,y:68},
			{time:1476272058,y:69},
			{time:1476272058,y:62},
			{time:1476272058,y:59},
			{time:1476272058,y:88},
			{time:1476272058,y:48},
			{time:1476272058,y:22},
			{time:1476272058,y:88},
			{time:1476272058,y:36},
			{time:1476272058,y:69}]
}];

var chart2 = $('#lineChart2').epoch({
	type: 'time.line',
	data: chart2Data,
	axes: ['bottom', 'left']
});
