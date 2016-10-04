var dataset = dataGenerator(200);
createLineChart(dataset);




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
