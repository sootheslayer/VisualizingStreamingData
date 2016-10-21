// Initialize websocket connection
var socket = io.connect('http://localhost:3000');

//-------------------------------------- CHART DEFINITIONS --------------------------------------

// Conversion Summary Small Chart
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


// Conversion Summary Modal Chart
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


// User distribution on map
function initMap() {
  var map = new google.maps.Map(document.getElementById('userMapChart'), {
    zoom: 3,
    center: {lat: -28.024, lng: 140.887},
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  var locations = [
    {lat: -31.563910, lng: 147.154312},
    {lat: -33.718234, lng: 150.363181},
    {lat: -33.727111, lng: 150.371124},
    {lat: -33.848588, lng: 151.209834},
    {lat: -33.851702, lng: 151.216968},
    {lat: -34.671264, lng: 150.863657},
    {lat: -35.304724, lng: 148.662905},
    {lat: -36.817685, lng: 175.699196},
    {lat: -36.828611, lng: 175.790222},
    {lat: -37.750000, lng: 145.116667},
    {lat: -37.759859, lng: 145.128708},
    {lat: -37.765015, lng: 145.133858},
    {lat: -37.770104, lng: 145.143299},
    {lat: -37.773700, lng: 145.145187},
    {lat: -37.774785, lng: 145.137978},
    {lat: -37.819616, lng: 144.968119},
    {lat: -38.330766, lng: 144.695692},
    {lat: -39.927193, lng: 175.053218},
    {lat: -41.330162, lng: 174.865694},
    {lat: -42.734358, lng: 147.439506},
    {lat: -42.734358, lng: 147.501315},
    {lat: -42.735258, lng: 147.438000},
    {lat: -43.999792, lng: 170.463352}
  ]
  var markers = locations.map(function(location, i) {
    return new google.maps.Marker({
      position: location,
    });
  });
  var markerCluster = new MarkerClusterer(map, markers, {imagePath: '../images/m'});
}


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