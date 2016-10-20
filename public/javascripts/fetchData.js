// Initialize websocket connection
var socket = io.connect('http://localhost:3000');

// var bouncePages;
// var bouncePagesData = [
// {
// 	key: "Top 10 BR Pages",
// 	values: []
// }];

// nv.addGraph(function() {
//     bouncePages = nv.models.multiBarHorizontalChart()
//         .x(function(d) { return d.label })
//         .y(function(d) { return d.value })
//         .margin({top: 20, right: 20, bottom: 20, left: 1})
//         .showControls(false)        //Allow user to switch between "Grouped" and "Stacked" mode.
//         .barColor(d3.scale.category20().range());

//     bouncePages.yAxis
//         .tickFormat(d3.format(',.2f'));

//     d3.select('#randomTest')
//     	.append('svg')
//         .datum(bouncePagesData)
//         .transition().duration(500)
//         .call(bouncePages);

//     nv.utils.windowResize(bouncePages.update);

//     return bouncePages;
// });

var shapes = ['circle', 'cross', 'triangle-up', 'triangle-down', 'diamond', 'square'];
var userSummaryChart;
var userSummaryChartData = [
{
	key: "Condo",
	values: []
},
{
	key: "vehicle",
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

nv.addGraph(function() {
    userSummaryChart = nv.models.scatterChart()
        .margin({right: 40})
        .showDistX(true)
        .showDistY(true)
        .showLabels(true)
        .useVoronoi(true)
        .color(d3.scale.category20().range())
        .duration(300)
        .clipEdge(true)
    ;
    userSummaryChart.dispatch.on('renderEnd', function(){
        console.log('render complete');
    });

    userSummaryChart.xAxis
    			.axisLabel('Time Spent (in mins)')
    			.tickFormat(d3.format('.02f'));
    
    userSummaryChart.yAxis
    			.axisLabel('Total hits')
					.tickFormat(d3.format('.02f'));

    d3.select('#randomTest')
    		.append('svg')
        .datum(userSummaryChartData)
        .transition().duration(1000)
        .call(userSummaryChart);

    nv.utils.windowResize(userSummaryChart.update);

    userSummaryChart.dispatch.on('stateChange', function(e) { ('New State:', JSON.stringify(e)); });
    return userSummaryChart;
});

$(document).ready(function(){

	// modal plugin intialization
	$('.modal-trigger').leanModal();

	// Pull data out cassandra by button
	$("#refreshData").click(function(){
		var query = "SELECT * FROM test_purchase_summary limit 50;";
		console.log('sending query to server: ' + query);
		socket.emit('fetch-data', query);
	});


}); // Document ready function closing bracket

socket.on('fetched-result',function(data){
	// bouncePagesData[0].values = [];
	userSummaryChartData.forEach(function(elem){elem.values = [];}); // Remove old values from chart
	data.forEach(function(row){
		var index = userSummaryChartData.findIndex(function(elem){
			if(elem.key === row.insurance){
			return true;
			}
		})
		userSummaryChartData[index].values.push({
			x: row.time_spent,
			y: row.visits_count,
			size: row.age,
			shape: shapes[index]
		});
	});
	 userSummaryChart.update();
});

// setInterval(function(){
// 	var query = "SELECT * FROM pages LIMIT 10";
// 	socket.emit('fetch-data', query);
// 	console.log("query sent to cassandra: " + query);
// }, 2000);