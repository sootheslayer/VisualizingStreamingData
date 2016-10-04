var dataGenerator = function(n) {
	var arr = [];
	for (var i = 0; i < n; i++) {
		arr.push({
			"index": i,
			"value": d3.randomNormal(20,2.5)()
		});
	}
	return arr;
};


function createLineChart(data) {
	var margin = {top: 20, right: 20, bottom: 30, left: 50},
			width = 600 - margin.left - margin.right,
			height = 300 - margin.top - margin.bottom;

	var x = d3.scaleLinear().range([0, width]);
	var y = d3.scaleLinear().range([height, 0]);

	var line = d3.line()
	    .x(function(d) { return x(d.index); })
	    .y(function(d) { return y(d.value); });

	var svg = d3.select("#graphs").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform",
	          "translate(" + margin.left + "," + margin.top + ")");

	x.domain(d3.extent(data, function(d) { return d.index; }));
	y.domain(d3.extent(data, function(d) { return d.value; }));

	svg.append("g")
	    .attr("class", "axis axis--x")
	    .attr("transform", "translate(0," + height + ")")
	    .call(d3.axisBottom(x));

	svg.append("g")
	    .attr("class", "axis axis--y")
	    .call(d3.axisLeft(y))
	  .append("text")
	    .attr("class", "axis-title")
	    .attr("transform", "rotate(-90)")
	    .attr("y", 6)
	    .attr("dy", ".71em")
	    .style("text-anchor", "end")
	    .text("Price ($)");

	svg.append("path")
	    .datum(data)
	    .attr("class", "line")
	    .attr("d", line);
}

