
function createLineChart(data) {
	var margin = {top: 20, right: 20, bottom: 30, left: 50},
			width = 600 - margin.left - margin.right,
			height = 300 - margin.top - margin.bottom;

	var x = d3.scaleLinear().range([0, width]);
	var y = d3.scaleLinear().range([height, 0]);

	var line = d3.line()
		.curve(d3.curveBasis)
	    .x(function(d) { return x(d.index); })
	    .y(function(d) { return y(d.value); });

	var svg = d3.select("#graphs").append("svg")
		.attr("id","static-chart")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform",
	          "translate(" + margin.left + "," + margin.top + ")");

	x.domain(d3.extent(data, function(d) { return d.index; }));
	y.domain(d3.extent(data, function(d) { return d.value; }));

	svg.append("g")
	    .attr("class", "axis x")
	    .attr("transform", "translate(0," + height + ")")
	    .call(d3.axisBottom(x));

	svg.append("g")
	    .attr("class", "axis y")
	    .call(d3.axisLeft(y))

	svg.append("path")
	    .datum(data)
	    .attr("class", "line")
	    .attr("d", line);
}

function createTimeSeriesLineChart(data){
	var margin = {top: 20, right: 20, bottom: 20, left: 30},
		width = 600 - margin.left - margin.right,
		height = 300 - margin.top - margin.bottom;

	// Function definition to parse time in hours minutes and seconds format
	// var parseTime = d3.timeParse("%H:%M:%S:%L");

	//Scales Defintion
	var x = d3.scaleTime().range([0,width]),
		y = d3.scaleLinear().range([height,0]);
	
	// Describe line generator
	var line = d3.line()
				.curve(d3.curveBasis)
				.x(function(d) {return x(d.timestamp); })
				.y(function(d){ return y(d.value); });

	// svg initialization
	var svg = d3.select("#graphs")
				.append("svg")
				.attr("id","real-time-chart")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform","translate(" + margin.left + "," + margin.top + ")");

	x.domain(d3.extent(data, function(d) { return d.timestamp; }));
	y.domain(d3.extent(data, function(d) { return d.value; }));

	//generate x axis
	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x));

	// generate y axis
	svg.append("g")
		.attr("class", "y axis")
		.call(d3.axisLeft(y))

	//generate path
	svg.append("path")
		.datum(data)
		.attr("class", "line")
		.attr("d", line);
}

function updateTimeSeriesLineChart(data) {
	// select the svg chart to update
	var svg = d3.select("#real-time-chart");

	// create scales reading the svg attributes
	var x = d3.scaleTime().range([0,svg.select(".x.axis").attr("width")]),
		y = d3.scaleLinear().range([svg.select(".y.axis").attr("height"),0]);

	// line generator definition
	var line = d3.line()
				.curve(d3.curveBasis)
				.x(function(d) {return x(d.timestamp); })
				.y(function(d){ return y(d.value); });

	x.domain(d3.extent(data, function(d) { return d.timestamp; }));
	y.domain(d3.extent(data, function(d) { return d.value; }));

	svg.select(".x.axis")
		.transition()
		.duration(500)
		.ease("linear")
		.call(x)

	svg.select(".y.axis")
		.transition()
		.duration(500)
		.ease("linear")
		.call(y)

	// svg.select("path")
	// 	.
}
