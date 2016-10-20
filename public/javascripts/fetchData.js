// Initialize websocket connection
var socket = io.connect('http://localhost:3000');

//-------------------------------------- CHART DEFINITIONS --------------------------------------

var shapes = ['circle', 'cross', 'triangle-up', 'triangle-down', 'diamond', 'square'];
var conversionScatterChart;
var conversionScatterChartData = [
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
    conversionScatterChart = nv.models.scatterChart()
        .margin({right: 40})
        .showDistX(true)
        .showDistY(true)
        .showLabels(true)
        .useVoronoi(true)
        .color(d3.scale.category20().range())
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

var conversionScatterModalChart;
nv.addGraph(function() {
    conversionScatterModalChart = nv.models.scatterChart()
        .margin({right: 40})
        .showDistX(true)
        .showDistY(true)
        .showLabels(true)
        .useVoronoi(true)
        .color(d3.scale.category20().range())
        .duration(300)
        .clipEdge(true)
    ;
    conversionScatterModalChart.dispatch.on('renderEnd', function(){
        console.log('render complete');
    });

    conversionScatterModalChart.xAxis
    			.axisLabel('Time Spent (in mins)')
    			.tickFormat(d3.format('.02f'));
    
    conversionScatterModalChart.yAxis
    			.axisLabel('Total Visits')
					.tickFormat(d3.format('.02f'));

    d3.select('#conversionSummaryModalChart')
    		.append('svg')
        .datum(conversionScatterChartData)
        .transition().duration(1000)
        .call(conversionScatterModalChart);

    nv.utils.windowResize(conversionScatterModalChart.update);

    conversionScatterModalChart.dispatch.on('stateChange', function(e) { ('New State:', JSON.stringify(e)); });
    return conversionScatterModalChart;
});

//------------------------------------- jQuery Definitions -----------------------------------

$(document).ready(function(){

	// modal plugin intialization
	$('.modal-trigger').leanModal();

	// Pull data out cassandra and update conversion summary chart small
	$("#refreshConversionSummaryData").click(function(){
		updateConversionSummaryChart("SELECT * FROM test_purchase_summary limit 50;");
	});

	// Pull data out cassandra and update conversion summary modal chart
	$("#refreshConversionSummaryModalChart").click(function(){
		updateConversionSummaryModalChart("SELECT * FROM test_purchase_summary limit 50;");
	});

	// update conversion summary modal chart
	$("#launchConversionSummaryModal").click(function(){
		updateConversionSummaryModalChart("SELECT * FROM test_purchase_summary limit 50;");
	});

}); // Document ready function closing bracket

//----------------------------------------  CHART UPDATE FUCNTIONS ---------------------------------

var updateConversionSummaryChart = function(query){
		console.log('sending query to server: ' + query);
		socket.emit('fetch-conversionSummaryChartData', query);

		socket.on('fetched-conversionSummaryChartData',function(data){
		conversionScatterChartData.forEach(function(elem){elem.values = [];}); // Remove old values from chart
		data.forEach(function(row){
			var index = conversionScatterChartData.findIndex(function(elem){
				if(elem.key === row.insurance){
				return true;
				}
			})
			conversionScatterChartData[index].values.push({
				x: row.time_spent,
				y: row.visits_count,
				size: row.age,
				shape: shapes[index]
			});
		});
		 conversionScatterChart.update();
	});
};

var updateConversionSummaryModalChart = function(query){
		console.log('sending query to server: ' + query);
		socket.emit('fetch-conversionSummaryChartData', query);

		socket.on('fetched-conversionSummaryChartData',function(data){
		conversionScatterChartData.forEach(function(elem){elem.values = [];}); // Remove old values from chart
		data.forEach(function(row){
			var index = conversionScatterChartData.findIndex(function(elem){
				if(elem.key === row.insurance){
				return true;
				}
			})
			conversionScatterChartData[index].values.push({
				x: row.time_spent,
				y: row.visits_count,
				size: row.age,
				shape: shapes[index]
			});
		});
		 conversionScatterModalChart.update();
	});
};