// Initialize websocket connection
var socket = io.connect('http://localhost:3000');

var bouncePages;
var bouncePagesData = [
{
	key: "Top 10 BR Pages",
	values: []
}];

nv.addGraph(function() {
    bouncePages = nv.models.multiBarHorizontalChart()
        .x(function(d) { return d.label })
        .y(function(d) { return d.value })
        .margin({top: 20, right: 20, bottom: 20, left: 1})
        .showControls(false)        //Allow user to switch between "Grouped" and "Stacked" mode.
        .barColor(d3.scale.category20().range());

    bouncePages.yAxis
        .tickFormat(d3.format(',.2f'));

    d3.select('#randomTest')
    	.append('svg')
        .datum(bouncePagesData)
        .transition().duration(500)
        .call(bouncePages);

    nv.utils.windowResize(bouncePages.update);

    return bouncePages;
});


$(document).ready(function(){
	// Pull data out cassandra by button
	$("#refreshData").click(function(){
		var query = "SELECT * FROM pages limit 10";
		console.log('sending query to server: ' + query);
		socket.emit('fetch-data', query);
	});

}); // Document ready function closing bracket

socket.on('fetched-result',function(data){
	bouncePagesData[0].values = [];
	data.forEach(function(row){
		// console.log(row);
		bouncePagesData[0].values.push({label: row.page, value: row.time});
	});
	bouncePages.update();
	console.log("updated chart");
});

setInterval(function(){
	var query = "SELECT * FROM pages LIMIT 10";
	socket.emit('fetch-data', query);
	console.log("query sent to cassandra: " + query);
}, 2000);