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
        values: [
            {
                "label" : "Vehicle" ,
                "value" : -1.8746444827653
            } ,
            {
                "label" : "Condo" ,
                "value" : -8.0961543492239
            } ,
            {
                "label" : "Home Owner" ,
                "value" : -0.57072943117674
            } ,
            {
                "label" : "Renters" ,
                "value" : -2.4174010336624
            } ,
            {
                "label" : "Flood" ,
                "value" : -0.72009071426284
            } ,
            {
                "label" : "Umbrella" ,
                "value" : -2.77154485523777
            }
        ]
    },
    {
        key: 'Conversion',
        values: [
            {
                "label" : "Vehicle" ,
                "value" : -1.8746444827653
            } ,
            {
                "label" : "Condo" ,
                "value" : -8.0961543492239
            } ,
            {
                "label" : "Home Owner" ,
                "value" : -0.57072943117674
            } ,
            {
                "label" : "Renters" ,
                "value" : -2.4174010336624
            } ,
            {
                "label" : "Flood" ,
                "value" : -0.72009071426284
            } ,
            {
                "label" : "Umbrella" ,
                "value" : -2.77154485523777
            }
        ]
    },
    {
        key: 'Retention',
        values: [
            {
                "label" : "Vehicle" ,
                "value" : -1.8746444827653
            } ,
            {
                "label" : "Condo" ,
                "value" : -8.0961543492239
            } ,
            {
                "label" : "Home Owner" ,
                "value" : -0.57072943117674
            } ,
            {
                "label" : "Renters" ,
                "value" : -2.4174010336624
            } ,
            {
                "label" : "Flood" ,
                "value" : -0.72009071426284
            } ,
            {
                "label" : "Umbrella" ,
                "value" : -2.77154485523777
            }
        ]
    }
];

nv.addGraph(function() {
        ecrChart = nv.models.multiBarHorizontalChart()
            .x(function(d) { return d.label })
            .y(function(d) { return d.value })
            // .yErr(function(d) { return [-Math.abs(d.value * Math.random() * 0.3), Math.abs(d.value * Math.random() * 0.3)] })
            // .barColor(d3.scale.category20().range())
            .duration(1050)
            .margin({left: 100})
            .stacked(true);

        ecrChart.yAxis.tickFormat(d3.format(',.2f'));

        ecrChart.yAxis.axisLabel('Y Axis');
        ecrChart.xAxis.axisLabel('X Axis').axisLabelDistance(20);

        d3.select('#ecrRatio')
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

//------------------------------------- jQuery Definitions -----------------------------------

$(document).ready(function(){

	// modal plugin intialization
	$('.modal-trigger').leanModal();
	
// -----------------------------------Conversion Summary-------------------------------------
	// Pull data and update conversion summary chart small
	$("#refreshConversionSummaryData").click(function(){
		updateConversionSummaryChart("SELECT * FROM test_purchase_summary limit 50;");
	});

	// Pull data and update conversion summary modal chart
	$("#refreshConversionSummaryModalChart").click(function(){
		updateConversionSummaryModalChart("SELECT * FROM test_purchase_summary limit 50;");
	});

	// update conversion summary modal chart
	$("#launchConversionSummaryModal").click(function(){
		updateConversionSummaryModalChart("SELECT * FROM test_purchase_summary limit 50;");
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
}); // Document ready function closing bracket

//----------------------------------------  CHART UPDATE FUCNTIONS ---------------------------------

var updateConversionSummaryChart = function(query){
		console.log('sending query toto update conversionSummaryChart server: ' + query);
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
		console.log('sending query to server to update conversionSummaryModalChart: ' + query);
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

var updateUserMaps = function(query){
	console.log('sending query to server to update maps: ' + query);
	socket.emit('fetch-latLong', query);

	socket.on('fetched-latLongData',function(data){
		locations = data.map(function(elem){
			return { lat: Number(elem.latitude), lng: Number(elem.longitude)};
		});

		initMap();
	});
};
