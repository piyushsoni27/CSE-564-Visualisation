// https://bl.ocks.org/jasondavies/1341281

var outerWidthpcp = 800,
    outerHeightpcp = 400,
    marginspcp = { top: 30, right: 50, bottom: 10, left: 70 },
    innerWidthpcp = outerWidthpcp - marginspcp.left - marginspcp.right,
    innerHeightpcp = outerHeightpcp - marginspcp.top - marginspcp.bottom;

function plot_pcp(pcp_data) {
    var countrytoid = {}
    var countries = []

    pcp_data.forEach(element => {
        countries.push(element["location"])
        countrytoid[element["location"]] = element["id"]
    });

    d3.select("#pcp").html("")
    var plotOuter = d3.select("#pcp").append("svg")
        .attr("width", outerWidthpcp)
        .attr("height", outerHeightpcp)


    plotInner = plotOuter
        .append('g')
        .attr('id', 'inner-plot')
        .attr('width', innerWidthpcp)
        .attr('height', innerHeightpcp)
        .attr('transform', 'translate(' + marginspcp.left + ',' + marginspcp.top + ')')

    var x,
        y = {},
        dimensions,
        dragging = {},
        background,
        foreground;

    var svg = plotInner;


    // Extract the list of dimensions as keys and create a y scale for each.
    dimensions = d3.keys(pcp_data[0]).filter(function(key) {
        if (key !== "" && key !== "location" && key != "id") {
            y[key] = d3.scaleLinear()
                .domain(d3.extent(pcp_data, function(d) { return +d[key]; }))
                .range([innerHeightpcp - 50, 0]);
            return key;
        }
        if (key === "location") {
            // console.log(pcp_data.location)
            y[key] = d3.scaleBand()
                .domain(countries)
                .range([innerHeightpcp - 50, 0]);
            return key;
        }

        ;
    });

    // Creata a x scale for each dimension
    x = d3.scalePoint()
        .domain(dimensions)
        .range([0, innerWidthpcp]);


    var color = d3.scaleOrdinal(d3.schemeCategory10);

    var highlight = function(d) {

        selected_cluster = d.cluster

        // first every group turns grey
        svg.selectAll(".line")
            .transition().duration(200)
            .style("stroke", "lightgrey")
            .style("opacity", "0.2")
            // console.log(selected_cluster)
        svg.selectAll(".cluster" + selected_cluster)
            .transition().duration(200)
            .style("stroke", color(selected_cluster))
            .style("opacity", "0.4")
    }

    // Unhighlight
    var doNotHighlight = function(d) {
        svg.selectAll(".line")
            .transition().duration(200).delay(1000)
            .style("stroke", function(d) { return (color(d.cluster)) })
            .style("opacity", "0.4")
    }

    // Add grey background lines for context.
    background = svg.append("g")
        .attr("class", "background")
        .selectAll("path")
        .data(pcp_data)
        .enter().append("path")
        .attr("d", line);

    // Add blue foreground lines for focus.
    foreground = svg.append("g")
        .attr("class", "foreground")
        .selectAll("path")
        .data(pcp_data)
        .enter()
        .append("path")
        .attr("d", line)
        .attr("class", function(d) { return "line " + d.id })
        .style('stroke', function(d) { return color(d.cluster); })
        .style("opacity", 0.7)
        .on("mouseover", highlight)
        .on("mouseleave", doNotHighlight);

    // Add a group element for each dimension.
    var g = svg.selectAll(".dimension")
        .data(dimensions)
        .enter().append("g")
        .attr("class", "dimension")
        .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
        .call(d3.drag()
            .on("start", function(d) {
                svg.selectAll(".line")
                    .transition().duration(200)
                    .style("stroke", "lightgrey")
                    .style("opacity", "0.2")
                dragging[d] = x(d);
                // background.attr("visibility", "hidden");
            })
            .on("drag", function(d) {
                dragging[d] = Math.min(width, Math.max(0, d3.event.x));
                foreground.attr("d", line);
                dimensions.sort(function(a, b) { return position(a) - position(b); });
                x.domain(dimensions);
                g.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
            })
            .on("end", function(d) {
                delete dragging[d];
                transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
                transition(foreground).attr("d", line);

                svg.selectAll(".line")
                    .transition().duration(200).delay(1000)
                    .style("stroke", function(d) { return (color(d.cluster)) })
                    .style("opacity", "0.4")
            }));

    // Add an axis and title.
    g.append("g")
        .attr("class", "axispcp")
        .each(function(d) { d3.select(this).call(d3.axisLeft().scale(y[d])); })
        .append("text")
        .style("text-anchor", "middle")
        .attr("transform", "rotate(-10)")
        .attr("fill", "rgb(156, 152, 152)")
        .attr("font-size", "13")
        .attr("y", -9)
        .text(function(d) { return d; })
        .style("stroke", "rgb(156, 152, 152)");

    // Add and store a brush for each axis.
    g.append("g")
        .attr("class", "brush")
        .each(function(d) {
            d3.select(this).call(y[d].brush = d3.brushY()
                .extent([
                    [-10, 0],
                    [10, innerHeightpcp]
                ])
                .on("start", brushstart)
                .on("brush", brush)
                .on("end", brushend));
        })
        .selectAll("rect")
        .attr("x", -8)
        .attr("width", 16);

    function position(d) {
        var v = dragging[d];
        return v == null ? x(d) : v;
    }

    function transition(g) {
        return g.transition().duration(500);
    }

    // Take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
    function line(d) {
        return d3.line()(dimensions.map(function(key) { return [x(key), y[key](d[key])]; }));
    }

    function brushstart() {
        // console.log("here")
        d3.event.sourceEvent.stopPropagation();
    }

    // Handles a brush event, toggling the display of foreground lines.
    function brush() {
        // Get a set of dimensions with active brushes and their current extent.
        var actives = [];
        svg.selectAll(".brush")
            .filter(function(d) {
                // console.log(d3.brushSelection(this));
                return d3.brushSelection(this);
            })
            .each(function(key) {
                actives.push({
                    dimension: key,
                    extent: d3.brushSelection(this)
                });
            });
        // Change line visibility based on brush extent.
        // console.log(actives)
        if (actives.length === 0) {
            foreground.style("display", null);
        } else {
            foreground.style("display", function(d) {
                // console.log(d)
                return actives.every(function(brushObj) {
                    return brushObj.extent[0] <= y[brushObj.dimension](d[brushObj.dimension]) && y[brushObj.dimension](d[brushObj.dimension]) <= brushObj.extent[1];
                }) ? null : "none";
            });
        }
    }

    function brushend() {
        // Get a set of dimensions with active brushes and their current extent.
        var actives = [];
        svg.selectAll(".brush")
            .filter(function(d) {
                // console.log(d3.brushSelection(this));
                return d3.brushSelection(this);
            })
            .each(function(key) {
                actives.push({
                    dimension: key,
                    extent: d3.brushSelection(this)
                });
            });
        // Change line visibility based on brush extent.
        if (actives.length === 0) {
            foreground.style("display", null);
        } else {
            foreground.style("display", function(d) {
                return actives.every(function(brushObj) {
                    return brushObj.extent[0] <= y[brushObj.dimension](d[brushObj.dimension]) && y[brushObj.dimension](d[brushObj.dimension]) <= brushObj.extent[1];
                }) ? null : "none";
            });
        }
        selected_countries = []
        d3.select('.foreground').selectAll('path').each(function(d) {
                if (d3.select(this).style("display") !== "none") {
                    selected_countries.push(d.id)
                }
            })
            // console.log(selected_countries)
    }

}