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
var domID = 'userMapChart';
var locations = [];
function initMap() {

  var map = new google.maps.Map(document.getElementById(domID), {
    zoom: 3,
    center: {lat: 39.833﻿, lng: -98.583},
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  var markers = locations.map(function(location, i) {
    return new google.maps.Marker({
      position: location,
    });
  });
  var markerCluster = new MarkerClusterer(map, markers, {imagePath: '../images/m'});
}


// ECR stacked bar chart
var ecrChart;
var ecrChartData = [
	    {
	        key: 'Engagement',
	        values: []
	    },
	    {
	        key: 'Conversion',
	        values: []
	    },
	    {
	        key: 'Retention',
	        values: []
	    }
];

nv.addGraph(function() {
        ecrChart = nv.models.multiBarHorizontalChart()
            .x(function(d) { return d.label })
            .y(function(d) { return d.value })
            .duration(500)
            .margin({left: 80})
            .stacked(true);

        ecrChart.yAxis.tickFormat(d3.format(',.2f'));

        ecrChart.yAxis.axisLabel('Number of hits');
        ecrChart.xAxis
        // .axisLabel('X Axis')
        .axisLabelDistance(20);

        d3.select('#ecrChart')
    		.append('svg')
            .datum(ecrChartData)
            .call(ecrChart);

        nv.utils.windowResize(ecrChart.update);

        ecrChart.dispatch.on('stateChange', function(e) { nv.log('New State:', JSON.stringify(e)); });
        ecrChart.state.dispatch.on('change', function(state){
            nv.log('state', JSON.stringify(state));
        });
        return ecrChart;
    });

// ECR stacked bar chart
var ecrModalChart;
nv.addGraph(function() {
        ecrModalChart = nv.models.multiBarHorizontalChart()
            .x(function(d) { return d.label })
            .y(function(d) { return d.value })
            .duration(500)
            .margin({left: 80})
            .stacked(true);

        ecrModalChart.yAxis.tickFormat(d3.format(',.2f'));

        ecrModalChart.yAxis.axisLabel('Number of hits');
        ecrModalChart.xAxis.axisLabelDistance(20);

        d3.select('#ecrModalChart')
        	.append('svg')
            .datum(ecrChartData)
            .call(ecrModalChart);

        nv.utils.windowResize(ecrModalChart.update);

        ecrModalChart.dispatch.on('stateChange', function(e) { nv.log('New State:', JSON.stringify(e)); });
        ecrModalChart.state.dispatch.on('change', function(state){
            nv.log('state', JSON.stringify(state));
        });
        return ecrModalChart;
    });

var queryLatencyChart;
var queryLatencyChartData = [{key: 'Query Latency',	values: []}];
var count = 1;
nv.addGraph(function() {
	queryLatencyChart = nv.models.lineChart()
	            .margin({left: 100})  //Adjust chart margins to give the x-axis some breathing room.
	            .useInteractiveGuideline(true)  //We want nice looking tooltips and a guideline!
	            .duration(500)  //how fast do you want the lines to transition?
	            .showLegend(true)       //Show the legend, allowing users to turn on/off line series.
	            .showYAxis(true)        //Show the y-axis
	            .showXAxis(true)        //Show the x-axis
	;

	queryLatencyChart.xAxis     //Chart x-axis settings
	  .axisLabel('Count')
	  .tickFormat(d3.format(',.1f'));

	queryLatencyChart.yAxis     //Chart y-axis settings
	  .axisLabel('Time (milliseconds)')
	  .tickFormat(d3.format('.02f'));

	d3.select('#queryLatencyChart')
		.append('svg')    //Select the <svg> element you want to render the chart in.   
		.datum(queryLatencyChartData)         //Populate the <svg> element with chart data...
		.call(queryLatencyChart);          //Finally, render the chart!

	//Update the chart when window resizes.
	nv.utils.windowResize(function() { queryLatencyChart.update() });
	return queryLatencyChart;
});


//------------------------------------- jQuery Definitions -----------------------------------

$(document).ready(function(){

	// modal plugin intialization
	$('.modal-trigger').leanModal();
	
// -----------------------------------Conversion Summary-------------------------------------
	// Pull data and update conversion summary chart small
	$("#refreshConversionSummaryData").click(function(){
		updateConversionSummaryChart("SELECT * FROM scatter_plot_table limit 100 ;");
	});

	// Pull data and update conversion summary modal chart
	$("#refreshConversionSummaryModalChart").click(function(){
		updateConversionSummaryChart("SELECT * FROM scatter_plot_table limit 200;");
	});

	// update conversion summary modal chart
	$("#launchConversionSummaryModal").click(function(){
		updateConversionSummaryChart("SELECT * FROM scatter_plot_table limit 200;");
	});

//----------------------------------------User Maps-------------------------------------------
	// Fetch location data for maps
	$("#refreshUserMapData").click(function(){
		updateUserMaps("SELECT latitude, longitude FROM log_table;");
	});

	// Launch modal for maps
	$("#launchUserMapModal").click(function(){
		domID = 'userMapsModalChart';
		initMap();
	});

	// Fetch location data for maps modal
	$("#refreshUserMapsModalChart").click(function(){
		updateUserMaps("SELECT latitude, longitude FROM log_table;");
	});

	$("#close-user-map").click(function(){
		domID = 'userMapChart';
		initMap();
	});

//-----------------------------------------------ECR----------------------------------------------
	// Pull data and update ECR bar chart small
	$("#refreshEcrData").click(function(){
		updateEcrChart("select * from user_table;");
	});

	// Pull data and update ECR modal bar chart
	$("#refreshEcrModalChart").click(function(){
		updateEcrChart("select * from user_table;");
	});

	// update ECR modal bar chart
	$("#launchEcrModal").click(function(){
		updateEcrChart("select * from user_table;");
	});

}); // Document ready function closing bracket

//----------------------------------------  CHART UPDATE FUCNTIONS ---------------------------------
var startTime;
var updateConversionSummaryChart = function(query){
	startTime = Date.now();
	// console.log('Querying cassandra with: ' + query);
	socket.emit('fetch-conversionSummaryChartData', query);
};

socket.on('fetched-conversionSummaryChartData',function(data){
	conversionScatterChartData.forEach(function(elem){elem.values = [];}); // Remove old values from chart

	conversionScatterChartData[0].values = data[0];
	conversionScatterChartData[1].values = data[1];
	conversionScatterChartData[2].values = data[2];
	conversionScatterChartData[3].values = data[3];
	conversionScatterChartData[4].values = data[4];
	conversionScatterChart.update();
	conversionScatterModalChart.update();
	console.log(`Time taken to update conversionSummaryChart is ${Date.now()-startTime} milliseconds.`);
	queryLatencyChartData[0].values.push({x:count++,y:(Date.now()-startTime)});
	queryLatencyChart.update();
});

var updateUserMaps = function(query){
	startTime = Date.now();
	console.log('Sending query to server to update maps: ' + query);
	socket.emit('fetch-latLong', query);	
};

socket.on('fetched-latLongData',function(data){
	locations = data.map(function(elem){
		return { lat: Number(elem.latitude), lng: Number(elem.longitude)};
	});

	initMap();
	console.log(`Time taken to update userMaps is ${Date.now()-startTime} milliseconds.`);
	queryLatencyChartData[0].values.push({x:count++,y:(Date.now()-startTime)});
	queryLatencyChart.update();
});

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


