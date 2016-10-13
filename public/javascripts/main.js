// Initialize websocket connection
var socket = io.connect('http://localhost:3000');

//Socket.io event handlers

// Bounce Rate Chart
socket.on('bounceRate', function (data) {
	bounceRateLinceChart.push([{time: Date.now(), y: Number(data)}]);
});

//Avg. Time spent line chart
socket.on('test2', function (data) {
	avgTimeSpentLineChart.push([{time: Date.now(), y: Number(data)}]);
});

//Stacked bar chart of time spent by insurance type 
socket.on('timeSpentByInsurance',function(data){
	var arr = data.trim().substring(1,data.length-1).split(",");
	hitsByCategoryBarChart.push([
		{time: Date.now(), y: Number(arr[0])},
		{time: Date.now(), y: Number(arr[1])},
		{time: Date.now(), y: Number(arr[2])},
		{time: Date.now(), y: Number(arr[3])},
		{time: Date.now(), y: Number(arr[4])},
		{time: Date.now(), y: Number(arr[5])}
		]);
});

// conversion rate KPI
socket.on('conversionRate', function(data){
	$('conversionRate').text(data);
});

// top 10 marketing channesl
socket.on('marketingChannel', function(data){
	var testData = [
        {label:"Category 1", value:19},
        {label:"Category 2", value:5},
        {label:"Category 3", value:13},
        {label:"Category 4", value:17},
        {label:"Category 5", value:19},
        {label:"Category 6", value:27}
    ];
	marketingChannelsBarChart(testData);
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
	label: "series1",
	values: []
},
{
	label: "series2",
	values: []
},
{
	label: "series1",
	values: []
},
{
	label: "series1",
	values: []
},
{
	label: "series1",
	values: []
},
{
	label: "series1",
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
    .range([130,255]);

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
	    // .attr("fill", function(d){return "rgb(0,0," + colorScale(d.value) + ")";})
	    ;

	bar.append("text")
	    .attr("x", function(d) { return x(d.value) - 3; })
	    .attr("y", barHeight / 2)
	    .attr("dy", ".35em")
	    .text(function(d) { return d.label; });
};

var testData = [
        {label:"Category 1", value:19},
        {label:"Category 2", value:5},
        {label:"Category 3", value:13},
        {label:"Category 4", value:17},
        {label:"Category 5", value:19},
        {label:"Category 6", value:27}
    ];

marketingChannelsBarChart(testData);
