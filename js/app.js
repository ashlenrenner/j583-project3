//hides the back button
function hideBack()
{
document.getElementById('back').style.display = "none";
}
 hideBack();

 //shows the back button
 function showBack()
 {
 document.getElementById('back').style.display = "";
 }

 //hides the update button
 function hideUpdateBtn()
 {
   document.getElementById('update').style.display = "none";
 }


//displays the first chart
function callChart(){

var margin = {top: 20, right: 100, bottom: 30, left: 100},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var parseYear = d3.time.format("%Y").parse;

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category20();
// color array
var bluescale4 = ["#FFAF2B", "#FF9F00", "#040301", "#A88346", "#EA680C", "#D58852"];

//color function pulls from array of colors stored in color.js
var color = d3.scale.ordinal().range(bluescale4);

// Defines the axes
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(4);

var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(4);
//define line
var line = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.population); });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



//getting the data
d3.tsv("data.tsv", function(error, data) {
  if (error) throw error;

  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "year"; }));

  data.forEach(function(d) {
    d.year = parseYear(d.year);
  });

  var boroughs = color.domain().map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        return {year: d.year, population: +d[name]};

      })
    };
  });

  x.domain(d3.extent(data, function(d) { return d.year; }));

//setting min and max values
  y.domain([
    d3.min(boroughs, function(c) { return d3.min(c.values, function(v) { return v.population; }); }),
    d3.max(boroughs, function(c) { return d3.max(c.values, function(v) { return v.population; }); })
  ]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Homeless Population");

//defining boroughs

  var borough = svg.selectAll(".borough")
      .data(boroughs)
    .enter().append("g")
      .attr("class", "borough")
//tooltip
      .on('mouseover', function(d) {
                d3.select('.tooltip')
                    .html(d.year + "<br />" + Math.round(d.population) )
                    .style('opacity', 1);
                  })
      .on('mouseout', function(d) {
              d3.select('.tooltip')
                  .style('opacity', 0);
          })
      .on('mousemove', function(d) {
              console.log(d3.event);
              d3.select('.tooltip')
                  .style('left', (d3.event.clientX + 20) + 'px')
                  .style('top', (d3.event.clientY) + 'px');
          });


  borough.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) { return color(d.name); });

  borough.append("text")
      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.year) + "," + y(d.value.population) + ")"; })
      .attr("x", 6)
      .attr("dy", ".35em")
      .text(function(d) { return d.name; });
});
hideBack();


}
  callChart();



// ** Update data section (Called from the onclick)
function updateData() {
    // remove the current chart
    d3.selectAll('.line')
      .remove();
    d3.selectAll('.borough')
        .remove();
    d3.selectAll('path')
        .remove();
    d3.selectAll('text')
        .remove();
    d3.selectAll('g')
        .remove();
    d3.selectAll('svg')
        .remove();


//Second chart
var margin = {top: 20, right: 100, bottom: 30, left: 100},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
            // Parse the date / time
            var parseYear = d3.time.format("%Y").parse;

            // Set the ranges
            var x = d3.time.scale().range([0, width]);
            var y = d3.scale.linear().range([height, 0]);

            // Define the axes
            var xAxis = d3.svg.axis().scale(x)
                .orient("bottom").ticks(5);

            var yAxis = d3.svg.axis().scale(y)
                .orient("left").ticks(5)
                .tickFormat( function(d) { return "$" + d } );

            // Define the line
            var valueline = d3.svg.line()
                .x(function(d) { return x(d.year); })
                .y(function(d) { return y(d.budget); });

            // Adds the svg canvas
            var svg = d3.select("body")
                .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)

                .append("g")
                    .attr("transform",
                          "translate(" + margin.left + "," + margin.top + ")");

var color = d3.scale.category20();
          // color array
          var bluescale4 = ["#FFAF2B"];
          var color = d3.scale.ordinal().range(bluescale4);

            // Get the data
            d3.csv("budget.csv", function(error, data) {
                data.forEach(function(d) {
                    d.year = parseYear(d.year);
                    d.budget = +d.budget;
                });

                // Scale the range of the data
                x.domain(d3.extent(data, function(d) { return d.year; }));
                y.domain([0, d3.max(data, function(d) { return d.budget; })]);

                // Add the valueline path.
                svg.append("path")
                    .attr("class", "line")
                    .attr("d", valueline(data));

                // Add the X Axis
                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis);

                // Add the Y Axis
                svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis)
                    .append("text")
                      .attr("transform", "rotate(-90)")
                      .attr("y", 6)
                      .attr("dy", ".71em")
                      .style("text-anchor", "end")
                      .text("Spending");


            });
    // });
    showBack();
    hideUpdateBtn();
}

//displays update button
function showUpdateBtn()
{
  document.getElementById('update').style.display = "";
}
showUpdateBtn();

//function for back button

function goBack(){
  d3.selectAll('.line')
    .remove();
  d3.selectAll('.budget')
      .remove();
  d3.selectAll('path')
      .remove();
  d3.selectAll('text')
      .remove();
  d3.selectAll('g')
      .remove();
  d3.selectAll('svg')
      .remove();

  callChart();
  showUpdateBtn();
}
