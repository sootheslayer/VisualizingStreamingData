// Initialize websocket connection
var socket = io.connect('http://localhost:3000');

var tupletoArray = function(tuple){
	return tuple.split(",").map(function(x){
	var arr = x.substring(1,x.length-1).split(",");
 	return {label: arr[0], value: Number(arr[1])};
});
};

//Socket.io event handlers

// Bounce Rate Chart
socket.on('bounceRate', function (data) {
	bounceRateLinceChart.push([{time: Date.now(), y: Number(data)}]);
});

//Avg. Time spent line chart
socket.on('averageTime', function (data) {
	avgTimeSpentLineChart.push([{time: Date.now(), y: Number(data)}]);
});

// var collectedValue = [];
// var i = 0;
//Stacked bar chart of time spent by insurance type 
socket.on('usersPerCategory',function(data){
	var arr = tupletoArray(data);
	console.log(arr);
	hitsByCategoryBarChart.push([
		{time: Date.now(), y: Number(arr[0].value)},
		{time: Date.now(), y: Number(arr[1].value)},
		{time: Date.now(), y: Number(arr[2].value)},
		{time: Date.now(), y: Number(arr[3].value)},
		{time: Date.now(), y: Number(arr[4].value)},
		{time: Date.now(), y: Number(arr[5].value)}
		]);
});

// conversion rate KPI
socket.on('conversionRate', function(data){
	$('conversionRate').text(data);
});

// top 10 marketing channels
socket.on('hitsByMarketingChannels', function(data){
	var arr = tupletoArray(data);
	marketingChannelsBarChart(arr);
});

// top 10 bounce rate pages
socket.on('top10BounceRate',function(data){

});

// Create charts
// var arrTest = [{time:1476272058,y:68},
// 			{time:1476272058,y:69},
// 			{time:1476272058,y:62},
// 			{time:1476272058,y:59},
// 			{time:1476272058,y:88},
// 			{time:1476272058,y:48},
// 			{time:1476272058,y:22},
// 			{time:1476272058,y:88},
// 			{time:1476272058,y:36},
// 			{time:1476272058,y:69}];

var bounceRateData = [{
	label: "test1",
	values: []
}];

var bounceRateLinceChart = $('#bounceRate').epoch({
	type: 'time.line',
	data: bounceRateData,
	axes: ['bottom', 'left']
});

var avgTimeSpentData = [{
	label: "test1",
	values: []
}];

var avgTimeSpentLineChart = $('#avgTimeSpent').epoch({
	type: 'time.line',
	data: avgTimeSpentData,
	axes: ['bottom', 'left']
});

var hitsByCategoryData = [
{
	label: "Vehicle Insurance",
	values: []
},
{
	label: "Home Owner Insurance",
	values: []
},
{
	label: "Condo Insurance",
	values: []
},
{
	label: "Renters Insurance",
	values: []
},
{
	label: "Flood Insurance",
	values: []
},
{
	label: "Umbrella Insurance",
	values: []
},
];

var hitsByCategoryBarChart = $('#hitsByCategory').epoch({
	type: 'time.bar',
	data: hitsByCategoryData,
	axes: ['bottom', 'left']
});

var marketingChannelsBarChart = function(data){
	var width = parseInt(d3.select('#top10MarketingChannels').style('width'), 10);
	var height = 300;//parseInt(d3.select('#top10MarketingChannels').style('height'), 10);
	var barHeight = height/data.length;

	var x = d3.scale.linear()
    .domain([0, d3.max(data, function(d){ return d.value;})])
    .range([0, width]);

    var colorScale = d3.scale.linear()
    .domain([0, d3.max(data, function(d){ return d.value;})])
    .range(['#80cbc4', '#00695c']);

    d3.select("#top10MarketingChannels")
    .selectAll('svg')
    .remove();

	var chart = d3.select("#top10MarketingChannels")
		.append('svg')
		.attr('class', "chart")
	    .attr("width", width)
	    .attr("height", height);

	var bar = chart.selectAll("g")
	    .data(data)
	  .enter().append("g")
	    .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

	bar.append("rect")
	    .attr("width", function(d){return x(d.value);})
	    .attr("height", barHeight - 1)
	    .attr("fill", function(d){return colorScale(d.value);})
	    ;

	bar.append("text")
	    .attr("x", function(d) { return x(d.value) - 3; })
	    .attr("y", barHeight / 2)
	    .attr("dy", ".35em")
	    .text(function(d) { return d.label; });
};


// marketingChannelsBarChart(testData);

var bounceRateBarChart = function(data){
	var width = parseInt(d3.select('#top10BounceRatePages').style('width'), 10);
	var height = 300;//parseInt(d3.select('#top10BounceRatePages').style('height'), 10);
	var barHeight = height/data.length;

	var x = d3.scale.linear()
    .domain([0, d3.max(data, function(d){ return d.value;})])
    .range([0, width]);

    var colorScale = d3.scale.linear()
    .domain([0, d3.max(data, function(d){ return d.value;})])
    .range(['#ffcc80', '#ef6c00']);

    d3.select("#top10BounceRatePages")
    .selectAll('svg')
    .remove();

	var chart = d3.select("#top10BounceRatePages")
		.append('svg')
		.attr('class', "chart")
	    .attr("width", width)
	    .attr("height", height);

	var bar = chart.selectAll("g")
	    .data(data)
	  .enter().append("g")
	    .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

	bar.append("rect")
	    .attr("width", function(d){return x(d.value);})
	    .attr("height", barHeight - 1)
	    .attr("fill", function(d){return colorScale(d.value);})
	    ;

	bar.append("text")
	    .attr("x", function(d) { return x(d.value) - 3; })
	    .attr("y", barHeight / 2)
	    .attr("dy", ".35em")
	    .text(function(d) { return d.label; });
};

// bounceRateBarChart(testData);

