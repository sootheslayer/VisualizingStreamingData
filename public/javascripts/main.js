var staticDataGenerator = function(n) {
	var arr = [];
	for (var i = 0; i < n; i++) {
		arr.push({
			"index": i,
			"value": d3.randomNormal(20,2.5)()
		});
	}
	return arr;
};

var timeSeriesDataGenerator = function(n) {
	var arr = [];
	for (var i = 0; i < n; i++) {
		arr.push({
			"timestamp": Date.now() + 5000*i,
			"value": d3.randomNormal(5,0.5)()
		});
	}
	return arr;
};

createLineChart(staticDataGenerator(20));
createTimeSeriesLineChart(timeSeriesDataGenerator(60));

// d3.interval(function(){
// 	var updateArr = timeSeriesDataGenerator(1);
// 	updateTimeSeriesLineChart(updateArr);
// },1500);




// var socket = io.connect('http://localhost:3000');
// var result = 0;
// socket.on('add', function (data) {
// 	result += parseInt(data.value);
// 	// console.log(result);
// 	$('#add').text(data.value);
// 	$('#result').text(result);
// });
// socket.on('sub', function (data) {
// 	result -= parseInt(data.value);
// 	// console.log(result);
// 	$('#subtract').text(data.value);
// 	$('#result').text(result);
// });
