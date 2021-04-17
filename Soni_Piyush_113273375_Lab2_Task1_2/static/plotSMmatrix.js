var width = 820,
    size = width/4 - 10,
    padding = 20,
    n=4 //number of columns

function cross(a, b) {
    var c = [], n = a.length, m = b.length, i, j;
    for (i = -1; ++i < n;) for (j = -1; ++j < m;) c.push({x: a[i], i: i, y: b[j], j: j});
    return c;
    }

function plotSMmatrix(data){
    // console.log(data)
    // console.log(d3.keys(data[0]).length)

    var domainByColumns = {},
      colNames = d3.keys(data[0]).filter(function(d) { return d !== "class"; }),
      n = colNames.length;

    colNames.forEach(function(col) {
    domainByColumns[col] = d3.extent(data, function(d) { return d[col]; });
    });

    var x = d3.scaleLinear()
    .range([padding / 2, size - padding / 2]);

    var y = d3.scaleLinear()
        .range([size - padding / 2, padding / 2]);

    var xAxis = d3.axisBottom()
        .scale(x)
        .ticks(6);

    var yAxis = d3.axisLeft()
        .scale(y)
        .ticks(6);

    var color = d3.scaleOrdinal(d3.schemeCategory10);

    xAxis.tickSize(size * n);
    yAxis.tickSize(-size * n);

    document.getElementById("scatterMatrix").innerHTML = ""
    var svg = d3.select("svg#scatterMatrix")
      .attr("width", size * n + padding)
      .attr("height", size * n + padding)
        .append("g")
      .attr("transform", "translate(" + padding + "," + padding / 2 + ")");

    svg.selectAll(".x.axis")
      .data(colNames)
        .enter().append("g")
      .attr("class", "x axis")
      .attr("transform", function(d, i) { return "translate(" + (n - i - 1) * size + ",0)"; })
      .each(function(d) { x.domain(domainByColumns[d]); d3.select(this).call(xAxis); });

    svg.selectAll(".y.axis")
      .data(colNames)
       .enter().append("g")
      .attr("class", "y axis")
      .attr("transform", function(d, i) { return "translate(0," + i * size + ")"; })
      .each(function(d) { y.domain(domainByColumns[d]); d3.select(this).call(yAxis); });

    var cell = svg.selectAll(".cell")
      .data(cross(colNames, colNames))
        .enter().append("g")
      .attr("class", "cell")
      .attr("transform", function(d) { return "translate(" + (n - d.i - 1) * size + "," + d.j * size + ")"; })
      .each(plot);

    // Titles for the diagonal.
    cell.filter(function(d) { return d.i === d.j; }).append("text")
    .attr("x", padding)
    .attr("y", padding)
    .attr("dy", ".71em")
    .text(function(d) { return d.x; });

    function plot(p) {
        var cell = d3.select(this);
    
        x.domain(domainByColumns[p.x]);
        y.domain(domainByColumns[p.y]);
    
        cell.append("rect")
            .attr("class", "frame")
            .attr("x", padding / 2)
            .attr("y", padding / 2)
            .attr("width", size - padding)
            .attr("height", size - padding);
    
        cell.selectAll("circle")
            .data(data)
            .enter().append("circle")
            .transition()
    .duration(500)
            .attr("cx", function(d) { return x(d[p.x]); })
            .attr("cy", function(d) { return y(d[p.y]); })
            .attr("r", 4)
            .style("fill", function(d) { return color(d.class); });
      }
}