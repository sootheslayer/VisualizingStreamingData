// Initialize websocket connection
var socket = io.connect('http://localhost:3000');

//Convert kafka messages arriving in tuples to arrays.
var tupletoArray = function(tuple){
	return tuple.split(", ").map(function(x){
	var arr = x.substring(1,x.length-1).split(",");
 	return {label: arr[0], value: Number(arr[1])};
});
};

// Create charts

// Bounce Rate Line Chart

var bounceRateLineChart; 
var bounceRateLineChartData = [
    {
      values: [],      //values - represents the array of {x,y} data points
      key: 'Bounce Rate', //key  - the name of the series.
      color: '#7cb342'  //color - optional: choose your own line color.
    }
    ];

nv.addGraph(function(){
    bounceRateLineChart = nv.models.lineChart()
                  .margin({left: 50, right: 30})
                  .useInteractiveGuideline(true)
                  .showLegend(true)
                  .showYAxis(true)
                  .showXAxis(true);

    bounceRateLineChart.xAxis
            .axisLabel('Time')
            .tickFormat(function(d){return d3.time.format('%H:%M:%S')(new Date(d));});

    bounceRateLineChart.yAxis
            .axisLabel('Bounce Rate')
            .tickFormat(d3.format('.2f'));

    d3.select('#bounceRate')
        .append('svg')
        .datum(bounceRateLineChartData)
        .transition().duration(500)
        .call(bounceRateLineChart);

    nv.utils.windowResize(function() { bounceRateLineChart.update(); });
    return bounceRateLineChart;
});

// Average Time spent on domain line chart
var avgTimeSpentLineChart;
var avgTimeSpentLineChartData = [
    {
      values: [],      //values - represents the array of {x,y} data points
      key: 'Average Time Spent', //key  - the name of the series.
      color: '#ff7f0e'  //color - optional: choose your own line color.
    }
    ];

nv.addGraph(function(){
    avgTimeSpentLineChart = nv.models.lineChart()
                  .margin({left: 50, right: 20})
                  .useInteractiveGuideline(true)
                  .showLegend(true);

    avgTimeSpentLineChart.xAxis
            .axisLabel('Time')
            .tickFormat(function(d){return d3.time.format('%H:%M:%S')(new Date(d));});

    avgTimeSpentLineChart.yAxis
            .axisLabel('Avg. Time Spent (min)')
            .tickFormat(d3.format('.2f'));

    
    d3.select('#avgTimeSpent')
        .append('svg')
        .datum(avgTimeSpentLineChartData)
        .transition().duration(500)
        .call(avgTimeSpentLineChart);

    nv.utils.windowResize(function() { avgTimeSpentLineChart.update(); });
    return avgTimeSpentLineChart;
});

// Visits by product category stacked area chart
var hitsByCategoryBarChart;
var hitsByCategoryBarChartData = [
{
	key: "Condo",
	values: []
},
{
	key: "Flood",
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
	key: "Umbrella",
	values: []
},
{
	key: "Vehicle",
	values: []
}
];

nv.addGraph(function() {
    hitsByCategoryBarChart = nv.models.stackedAreaChart()
                  .margin({right: 100})
                  .x(function(d) { return d[0]; })   //We can modify the data accessor functions...
                  .y(function(d) { return d[1]; })   //...in case your data is formatted differently.
                  .useInteractiveGuideline(true)    //Tooltips which show all data points. Very nice!
                  .rightAlignYAxis(true)      //Let's move the y-axis to the right side.
                  .showControls(true)       //Allow user to choose 'Stacked', 'Stream', 'Expanded' mode.
                  .clipEdge(true)
                  .color(d3.scale.category20().range());

    //Format x-axis labels with custom function.
    hitsByCategoryBarChart.xAxis
        .axisLabel('Time')
        .tickFormat(function(d){return d3.time.format('%H:%M:%S')(new Date(d));});

    hitsByCategoryBarChart.yAxis
    	.axisLabel('No. of Visits')
        .tickFormat(d3.format(',.2f'));

    d3.select('#hitsByCategory')
    	.append('svg')
    	.datum(hitsByCategoryBarChartData)
    	.transition().duration(500)
    	.call(hitsByCategoryBarChart);

    nv.utils.windowResize(hitsByCategoryBarChart.update);

    return hitsByCategoryBarChart;
  });

// Marketing by channels horizontal bar chart
var marketingChannelsBarChart;
var marketingChannelsBarChartData = [
{
	key: "Marketing Channels",
	values: []
}];

nv.addGraph(function() {
    marketingChannelsBarChart = nv.models.multiBarHorizontalChart()
        .x(function(d) { return d.label; })
        .y(function(d) { return d.value; })
        .margin({top: 20, right: 20, bottom: 20, left: 100})
        .showControls(false)        //Allow user to switch between "Grouped" and "Stacked" mode.
        .barColor(d3.scale.category20().range());

    marketingChannelsBarChart.yAxis
        .tickFormat(d3.format(',.2f'));

    d3.select('#topMarketingChannels')
    	.append('svg')
        .datum(marketingChannelsBarChartData)
        .transition().duration(500)
        .call(marketingChannelsBarChart);

    nv.utils.windowResize(marketingChannelsBarChart.update);

    return marketingChannelsBarChart;
  });

// Top 10 Bounce rate pages horizontal bar chart
var bounceRateBarChart;
var bounceRateBarChartData = [
{
	key: "Top 10 BR Pages",
	values: []
}];

nv.addGraph(function() {
    bounceRateBarChart = nv.models.multiBarHorizontalChart()
        .x(function(d) { return d.label })
        .y(function(d) { return d.value })
        .margin({top: 20, right: 20, bottom: 20, left: 1})
        .showControls(false)        //Allow user to switch between "Grouped" and "Stacked" mode.
        .barColor(d3.scale.category20().range());

    bounceRateBarChart.yAxis
        .tickFormat(d3.format(',.2f'));

    d3.select('#top10BounceRatePages')
    	.append('svg')
        .datum(bounceRateBarChartData)
        .transition().duration(500)
        .call(bounceRateBarChart);

    nv.utils.windowResize(bounceRateBarChart.update);

    return bounceRateBarChart;
  });

//--------------------------------------Socket.io event handlers------------------------------------

// Bounce Rate Chart
socket.on('bounceRate', function (data) {
	bounceRateLineChartData[0].values.push({x: Date.now(), y: Number(data)});
	if(bounceRateLineChartData[0].values.length > 30) {
		bounceRateLineChartData[0].values.shift();
	}
	bounceRateLineChart.update();
});

//Avg. Time spent line chart
socket.on('averageTime', function (data) {
	avgTimeSpentLineChartData[0].values.push({x: Date.now(), y: Number(data)});
	if(avgTimeSpentLineChartData[0].values.length > 30) {
		avgTimeSpentLineChartData[0].values.shift();
	}
	avgTimeSpentLineChart.update();
});

//Stacked bar chart of time spent by insurance type 
socket.on('usersPerCategory',function(data){
	var arr = tupletoArray(data);
	hitsByCategoryBarChartData[0].values.push([ Date.now(), Number(arr[0].value)]);
	hitsByCategoryBarChartData[1].values.push([ Date.now(), Number(arr[1].value)]);
	hitsByCategoryBarChartData[2].values.push([ Date.now(), Number(arr[2].value)]);
	hitsByCategoryBarChartData[3].values.push([ Date.now(), Number(arr[3].value)]);
	hitsByCategoryBarChartData[4].values.push([ Date.now(), Number(arr[4].value)]);
	hitsByCategoryBarChartData[5].values.push([ Date.now(), Number(arr[5].value)]);
	if(hitsByCategoryBarChartData[0].values.length > 30) {
		hitsByCategoryBarChartData[0].values.shift();
		hitsByCategoryBarChartData[1].values.shift();
		hitsByCategoryBarChartData[2].values.shift();
		hitsByCategoryBarChartData[3].values.shift();
		hitsByCategoryBarChartData[4].values.shift();
		hitsByCategoryBarChartData[5].values.shift();
	}
	// console.log('error before update');
	hitsByCategoryBarChart.update();
});

// top 10 marketing channels
socket.on('hitsByMarketingChannels', function(data){
	marketingChannelsBarChartData[0].values = tupletoArray(data);
	marketingChannelsBarChart.update();
});

// top 10 bounce rate pages
socket.on('pagesByBounceRate',function(data){
	bounceRateBarChartData[0].values = tupletoArray(data);
	bounceRateBarChart.update();
});

