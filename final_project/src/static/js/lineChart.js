// https: //bl.ocks.org/EfratVil/92f894ac0ba265192411e73f633a3e2f
// https: //observablehq.com/@connor-roche/multi-line-chart-focus-context-w-mouseover-tooltip
//https://www.d3-graph-gallery.com/graph/bubble_template.html

// var outerWidthLine = 960,
//     outerHeightLine = 500 / 960 * outerWidthLine
// var marginUpperLineChart = { top: 20, right: 20, bottom: 110, left: 40 }
// var marginBottomLineChart = { top: 430, right: 20, bottom: 50, left: 40 }
// var innerWidthLine = outerWidthLine - marginUpperLineChart.left - marginUpperLineChart.right - 10
// var innerHeightLine = outerHeightLine - marginBottomLineChart.top - marginBottomLineChart.bottom - 10

var outerWidthLine = 760,
    outerHeightLine = 425 / 760 * outerWidthLine
var marginUpperLineChart = { top: 10, right: 70, bottom: 110, left: 40 }
var marginBottomLineChart = { top: 355, right: 70, bottom: 50, left: 40 }
var innerWidthLine = outerWidthLine - marginUpperLineChart.left - marginUpperLineChart.right - 10
var innerHeightLine = outerHeightLine - marginUpperLineChart.top - marginUpperLineChart.bottom - 10

var start_date
var end_date
var data
var bubbledata
var linedata_max
var linedata_min
var bubbledata_max
var bubbledata_min

function createLineChart(data1, bubbledata1, attr) {
    data = data1
    bubbledata = bubbledata1
        // console.log(bubbledata)

    document.getElementById("linechart").innerHTML = "";

    var isClicked = false
    var clicked_bubble = ""

    var plotOuter = d3.select("#linechart")
        .append("svg")
        .attr("width", outerWidthLine)
        .attr("height", outerHeightLine)

    svg = plotOuter
        .append('g')
        .attr('id', 'inner-plot')
        .attr('width', innerWidthLine)
        .attr('class', 'linebubblechart')
        .attr('height', innerHeightLine)
        .attr('transform', 'translate(' + marginUpperLineChart.left + ',' + marginUpperLineChart.top + ')')

    margin = marginUpperLineChart,
        margin2 = marginBottomLineChart,
        width = outerWidthLine - margin.left - margin.right,
        height = outerHeightLine - margin.top - margin.bottom,
        height2 = outerHeightLine - margin2.top - margin2.bottom;

    var parseDate = d3.timeParse("%Y-%m-%d");
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return d.Measure_L1;
        })

    data.forEach(d => {
        d.date = parseDate(d.date)
        d[attr] = +d[attr]
    });

    bubbledata.forEach(d => {
        d.date = parseDate(d.date)
        d.Count = +d.Count
    });

    var sumstat = d3.nest()
        .key(d => d.covidattr)
        .entries(data);

    // console.log(sumstat)
    // for (let key of Object.keys(sumstat)) {
    //     let bucket = sumstat[key];
    //     console.log(bucket.key)
    // }

    linedata_max = d3.max(data, function(d) { return +d[attr]; })
    linedata_min = d3.min(data, function(d) { return +d[attr]; })
    bubbledata_max = d3.max(bubbledata, function(d) { return d.Count; })
    bubbledata_min = d3.min(bubbledata, function(d) { return d.Count; })

    var x = d3.scaleTime().range([0, width]),
        x2 = d3.scaleTime().range([0, width]),
        y = d3.scaleLinear().range([height, 0]),
        y2 = d3.scaleLinear().range([height2, 0]),
        yright = d3.scaleLinear().range([height, 0]);
    // y = d3.scaleLog().range([height, 0]),
    // y2 = d3.scaleLog().range([height2, 0]);

    var xAxis = d3.axisBottom(x),
        xAxis2 = d3.axisBottom(x2),
        yAxis = d3.axisLeft(y),
        yAxisright = d3.axisRight(yright);

    // Add a scale for bubble size
    var z = d3.scaleSqrt()
        .domain([bubbledata_min, bubbledata_max])
        .range([5, 20]);

    // Add a scale for bubble color
    var myColor = d3.scaleOrdinal()
        .domain(["Contact_tracing", "Social_distancing", "Travel_restriction", "Resource_allocation", "Risk_communication", "Public_Healthcare", "Ease_of_restrictions"])
        .range(d3.schemeSet2);

    var brush = d3.brushX()
        .extent([
            [0, 0],
            [width, height2]
        ])
        .on("brush", brushed)
        .on("end", brushend);

    var zoom = d3.zoom()
        .scaleExtent([1, Infinity])
        .translateExtent([
            [0, 0],
            [width, height]
        ])
        .extent([
            [0, 0],
            [width, height]
        ])
        .on("zoom", zoomed)
        .on("end", zoomend);

    var line = d3
        .line()
        .x(d => x(d.date))
        .y(d => y(+d[attr]));

    // create line for context chart
    var line2 = d3
        .line()
        .x(d => x2(d.date))
        .y(d => y2(+d[attr]));

    svg.call(tip)
    var clip = svg.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", width)
        .attr("height", height)
        .attr("x", 0)
        .attr("y", 0);

    var bubble_chart = svg.append("g")
        .attr("class", "focus")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("clip-path", "url(#clip)");

    var Line_chart = svg.append("g")
        .attr("class", "focus")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("clip-path", "url(#clip)");

    var focus = svg.append("g")
        .attr("class", "focus")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var context = svg.append("g")
        .attr("class", "context")
        .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

    // ---------------------------//
    //       HIGHLIGHT GROUP      //
    // ---------------------------//

    // What to do when one group is hovered
    var currMeasure = "None"
    var highlight = function(d) {
        currMeasure = d
            // reduce opacity of all groups
        d3.selectAll(".bubbles").style("opacity", .05)
            // expect the one that is hovered
        d3.selectAll("." + d).style("opacity", 1)
    }

    // And when it is not hovered anymore
    var noHighlight = function(d) {
        currMeasure = "None"
        d3.selectAll(".bubbles").style("opacity", 0.5)
    }

    x.domain(d3.extent(data, function(d) { return d.date; }));
    // y.domain((([1, 1000000000])
    y.domain([0, d3.max(data, function(d) { return d[attr]; })]);
    // y.domain([0, 10000]);
    x2.domain(x.domain());
    y2.domain(y.domain());

    if (bubbledata_max > 160) {
        yright.domain([0, d3.max(bubbledata, function(d) { return d.Count; }) + 20]);
    } else {
        yright.domain([0, d3.max(bubbledata, function(d) { return d.Count; }) + 5]);
    }

    focus.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    focus.append("g")
        .attr("class", "axis axis--y")
        .call(yAxis);
    focus.append("g")
        .attr("class", "axis axis--yright")
        .attr("transform", "translate(" + width + ",0)")
        .call(yAxisright);

    focus.append("text")
        .attr("transform", "translate(" + width / 2 + " ," + (height + margin.top + 28) + ")")
        .style("text-anchor", "middle")
        .style("font-size", "20px")
        .text("Time");

    // focus chart y label
    focus.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "translate(" + (-margin.left - 10) + "," + height / 2 + ")rotate(-90)")
        .style("font-size", "18px")
        .text("Number of Cases");

    bubble_chart.selectAll("dot")
        .data(bubbledata)
        .enter()
        .append("circle")
        .attr("class", function(d) { return "bubbles " + d.Measure_L1 })
        .on('mouseover', function(d) {

            if (!isClicked) {
                tip.show(d);

                d3.select(this)
                    .style("opacity", 1)
                    .style("stroke", "white")
                    .style("stroke-width", 3);
            }
        })
        .on('mouseout', function(d) {
            if (!isClicked) {
                tip.hide(d);
                d3.select(this)
                    .style("opacity", 0.8)
                    .style("stroke", "white")
                    .style("stroke-width", 0.3);
            }
        })
        .transition().duration(1000)
        .attr("cx", function(d) { return x(d.date); })
        .attr("cy", function(d) { return yright(d.Count); })
        .attr("r", function(d) { return z(d.Count); })
        .style("fill", function(d) { return myColor(d.Measure_L1); })
        .style("opacity", .5);

    Line_chart
        .append("path")
        .datum(data)
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", 'black')
        .attr("stroke-width", 4.5)
        .attr("d", line);
    context
        .append("path")
        .datum(data)
        .attr("class", "line_mini")
        .attr("fill", "none")
        .attr("stroke", 'black')
        .attr("stroke-width", 1.5)
        .attr("d", line2);

    context.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height2 + ")")
        .call(xAxis2);

    context.append("g")
        .attr("class", "brush")
        .call(brush)
        .call(brush.move, x.range());

    svg.append("rect")
        .attr("class", "zoom")
        .attr("width", width / 2)
        .attr("height", height / 2)
        .attr("transform", "translate(" + (margin.left + 300) + "," + margin.top + ")")
        .call(zoom);

    // Add one dot in the legend for each name.
    var size = 8
    var allgroups = ["Contact_tracing", "Social_distancing", "Travel_restriction", "Resource_allocation", "Risk_communication", "Public_Healthcare", "Ease_of_restrictions"]

    svg.selectAll("myrect")
        .data(allgroups)
        .enter()
        .append("circle")
        .attr("class", function(d) { return "circlelegend legend_circle_" + d })
        .attr("cx", 310)
        .attr("cy", function(d, i) { return 10 + i * (size + 5) })
        .attr("r", 4)
        .style("fill", function(d) { return myColor(d) })
        .on("mouseover", function(d) {
            // console.log(d)
            if (!isClicked) {
                d3.select("." + "legend_circle_" + d).attr("r", 7)
                highlight(d);
            }
        })
        .on("mouseleave", function(d) {
            if (!isClicked) {
                d3.select("." + "legend_circle_" + d).attr("r", 4)
                noHighlight(d);
            }
        })
        .on("click", function(d) {
            if (!isClicked) {
                d3.selectAll(".circlelegend").attr("r", 4)
                d3.select("." + "legend_circle_" + d).attr("r", 7)
                highlight(d);
                isClicked = !isClicked
            } else {
                d3.select("." + "legend_circle_" + d).attr("r", 4)
                noHighlight(d)
                isClicked = !isClicked
            }
        })


    // Add labels beside legend dots
    svg.selectAll("mylabels")
        .data(allgroups)
        .enter()
        .append("text")
        .attr("class", function(d) { return "textlegend legend_text_" + d })
        .attr("x", 310 + size * .8)
        .attr("y", function(d, i) { return i * (size + 5) + (size / 2) + 5 })
        .style("fill", function(d) { return myColor(d) })
        .text(function(d) { return d })
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .style("font-size", "8px")
        .on("mouseover", function(d) {
            if (!isClicked) {
                d3.select("." + "legend_text_" + d).style("font-size", "14px")
                highlight(d);
            }
        })
        .on("mouseleave", function(d) {
            if (!isClicked) {
                d3.select("." + "legend_text_" + d).style("font-size", "8px")
                noHighlight(d);
            }
        })
        .on("click", function(d) {
            if (!isClicked) {
                d3.selectAll(".textlegend").style("font-size", "8px")
                d3.select("." + "legend_text_" + d).style("font-size", "14px")
                highlight(d);
                isClicked = !isClicked
                    // console.log(isClicked)
            } else {
                d3.select("." + "legend_text_" + d).style("font-size", "8px")
                noHighlight(d)
                isClicked = !isClicked
            }
        })

    function brushed(d) {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom" || (d3.event.sourceEvent && d3.event.sourceEvent.type === "end")) return; // ignore brush-by-zoom
        var s = d3.event.selection || x2.range();

        x.domain(s.map(x2.invert, x2));

        bubble_chart.selectAll(".bubbles")
            .attr("cx", function(d) { return x(d.date); })
            .attr("cy", function(d) { return yright(d.Count); })
            .attr("r", function(d) { return z(d.Count); })
            .style("fill", function(d) { return myColor(d.Measure_L1); })
            // .style("opacity", .5)
        if (currMeasure == "None") {
            d3.selectAll(".bubbles").style("opacity", .5)
        } else {
            d3.selectAll(".bubbles").style("opacity", .05)
                // expect the one that is hovered
            d3.selectAll("." + currMeasure).style("opacity", 1)
        }

        Line_chart.selectAll(".line").attr("d", line);
        focus.select(".axis--x").call(xAxis);
        focus.select(".axis--y").call(yAxis);
        focus.select(".axis--yright").call(yAxisright);
        svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
            .scale(width / (s[1] - s[0]))
            .translate(-s[0], 0));
    }

    function brushend(d) {
        if ((d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") || (d3.event.sourceEvent && d3.event.sourceEvent.type === "end")) return; // ignore brush-by-zoom
        var s = d3.event.selection || x2.range();
        start_date = new Date(s.map(x2.invert, x2)[0])
        end_date = new Date(s.map(x2.invert, x2)[1])

        selected_start_date = start_date.getFullYear() + '-' + (start_date.getMonth() + 1) + '-' + start_date.getDate()
        selected_end_date = end_date.getFullYear() + '-' + (end_date.getMonth() + 1) + '-' + end_date.getDate()

        lineChartTrigger.a = selected_start_date

        x.domain(s.map(x2.invert, x2));

        bubble_chart.selectAll(".bubbles")
            .attr("cx", function(d) { return x(d.date); })
            .attr("cy", function(d) { return yright(d.Count); })
            .attr("r", function(d) { return z(d.Count); })
            .style("fill", function(d) { return myColor(d.Measure_L1); })
            // .style("opacity", .5)
        if (currMeasure == "None") {
            d3.selectAll(".bubbles").style("opacity", .5)
        } else {
            d3.selectAll(".bubbles").style("opacity", .05)
                // expect the one that is hovered
            d3.selectAll("." + currMeasure).style("opacity", 1)
        }

        Line_chart.selectAll(".line").attr("d", line);
        focus.select(".axis--x").call(xAxis);
        svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
            .scale(width / (s[1] - s[0]))
            .translate(-s[0], 0));
    }

    function zoomed() {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush" || (d3.event.sourceEvent && d3.event.sourceEvent.type === "end")) return; // ignore zoom-by-brush
        var t = d3.event.transform;
        // console.log("Zoom 0 " + t.rescaleX(x2).domain()[0])
        // console.log("Zoom 1" + t.rescaleX(x2).domain()[1])
        x.domain(t.rescaleX(x2).domain());
        bubble_chart.selectAll(".bubbles")
            .attr("cx", function(d) { return x(d.date); })
            .attr("cy", function(d) { return yright(d.Count); })
            .attr("r", function(d) { return z(d.Count); })
            .style("fill", function(d) { return myColor(d.Measure_L1); })
            // .style("opacity", .5)
        if (currMeasure == "None") {
            d3.selectAll(".bubbles").style("opacity", .5)
        } else {
            d3.selectAll(".bubbles").style("opacity", .05)
                // expect the one that is hovered
            d3.selectAll("." + currMeasure).style("opacity", 1)
        }

        Line_chart.selectAll(".line").attr("d", line);
        focus.select(".axis--x").call(xAxis);
        context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
    }

    function zoomend() {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush" || (d3.event.sourceEvent && d3.event.sourceEvent.type === "end")) return; // ignore zoom-by-brush
        var t = d3.event.transform;
        start_date = new Date(t.rescaleX(x2).domain()[0])
        end_date = new Date(t.rescaleX(x2).domain()[1])

        selected_start_date = start_date.getFullYear() + '-' + (start_date.getMonth() + 1) + '-' + start_date.getDate()
        selected_end_date = end_date.getFullYear() + '-' + (end_date.getMonth() + 1) + '-' + end_date.getDate()

        console.log("Zoom 0 " + selected_start_date)
        console.log("Zoom 1 " + selected_end_date)

        lineChartTrigger.a = selected_start_date

        x.domain(t.rescaleX(x2).domain());

        bubble_chart.selectAll(".bubbles")
            .attr("cx", function(d) { return x(d.date); })
            .attr("cy", function(d) { return yright(d.Count); })
            .attr("r", function(d) { return z(d.Count); })
            .style("fill", function(d) { return myColor(d.Measure_L1); })
            // .style("opacity", .5)
        if (currMeasure == "None") {
            d3.selectAll(".bubbles").style("opacity", .5)
        } else {
            d3.selectAll(".bubbles").style("opacity", .05)
                // expect the one that is hovered
            d3.selectAll("." + currMeasure).style("opacity", 1)
        }

        Line_chart.selectAll(".line").attr("d", line);
        focus.select(".axis--x").call(xAxis);
        context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
    }

    function type(d) {
        d.date = parseDate(d.date);
        d.new_cases = +d.new_cases;
        return d;
    }

    function updateLineChart(data1, bubbledata1, attr_new) {
        // console.log("update")
        data = data1
        bubbledata = bubbledata1
            // console.log(bubbledata.length)

        var parseDate = d3.timeParse("%Y-%m-%d");

        data.forEach(d => {
            d.date = parseDate(d.date)
            d[attr] = +d[attr]
        });

        bubbledata.forEach(d => {
            d.date = parseDate(d.date)
            d.Count = +d.Count
        });

        linedata_max = d3.max(data, function(d) { return +d[attr]; })
        linedata_min = d3.min(data, function(d) { return +d[attr]; })
        bubbledata_max = d3.max(bubbledata, function(d) { return d.Count; })
        bubbledata_min = d3.min(bubbledata, function(d) { return d.Count; })

        x.domain(d3.extent(data, function(d) { return d.date; }));
        y.domain([0, d3.max(data, function(d) { return d[attr]; })]);
        x2.domain(x.domain());
        y2.domain(y.domain());
        if (bubbledata_max > 160) {
            yright.domain([0, d3.max(bubbledata, function(d) { return d.Count; }) + 20]);
        } else {
            yright.domain([0, d3.max(bubbledata, function(d) { return d.Count; }) + 5]);
        }

        d3.select(".axis--x").transition().duration(1000).call(xAxis);
        d3.select(".axis--y").transition().duration(1000).call(yAxis);
        d3.select(".axis--yright").transition().duration(1000).call(yAxisright);

        d3.select('.line').datum(data).transition().duration(1000).attr('d', line)
            // console.log(d3.select('.brush').selection)
            // d3.select('.selection').selection = x.range()
            // d3.select('.brush').move(d3.brushSelection, x.range())
            // d3.select('.brush').click()

        var bubblepoints = bubble_chart.selectAll(".bubbles").data(bubbledata)
        bubblepoints.enter()
            .append("circle")
            .merge(bubblepoints)
            .attr("class", function(d) { return "bubbles " + d.Measure_L1 })
            .on('mouseover', function(d) {

                if (!isClicked) {
                    tip.show(d);

                    d3.select(this)
                        .style("opacity", 1)
                        .style("stroke", "white")
                        .style("stroke-width", 3);
                }
            })
            .on('mouseout', function(d) {
                if (!isClicked) {
                    tip.hide(d);
                    d3.select(this)
                        .style("opacity", 0.8)
                        .style("stroke", "white")
                        .style("stroke-width", 0.3);
                }
            })
            .transition().duration(1000)
            .attr("cx", function(d) { return x(d.date); })
            // .attr("cy", function(d) { return y((d.Count / (bubbledata_max)) * ((linedata_max - linedata_min) / 1.1)); })
            .attr("cy", function(d) { return yright(d.Count); })
            .attr("r", function(d) { return z(d.Count); })
            .style("fill", function(d) { return myColor(d.Measure_L1); })
            // .style("opacity", .5)

        bubblepoints.exit().remove()
        if (currMeasure == "None") {
            d3.selectAll(".bubbles").style("opacity", .5)
        } else {
            d3.selectAll(".bubbles").style("opacity", .05)
                // expect the one that is hovered
            d3.selectAll("." + currMeasure).style("opacity", 1)
        }

        if (bubbledata.length == 0) {
            d3.selectAll(".textlegend").transition().duration(1000).style("visibility", "hidden");
            d3.selectAll(".circlelegend").transition().duration(1000).style("visibility", "hidden");
        } else {
            d3.selectAll(".textlegend").transition().duration(1000).style("visibility", "visible");
            d3.selectAll(".circlelegend").transition().duration(1000).style("visibility", "visible");
        }
        d3.select('.line_mini').datum(data).transition().duration(1000).attr('d', line2)
    }

    worldMapTrigger.registerListener(function(val) {
        worldMapTrigger2.a = worldmap_country
        $(document).ready(function() {
            $.ajax({
                type: "POST",
                url: "/linechart",
                contentType: "application/json",
                data: JSON.stringify(worldmap_country),
                dataType: "json",
                success: function(response) {
                    lineBubbleData = (response)
                    linedata = lineBubbleData['lined']
                    bubbledata = lineBubbleData['bubbled']
                    statData = linedata
                    statsTrigger2.a = statData
                    updateLineChart(linedata, bubbledata, selected_attr)
                },
                error: function(err) {
                    console.log(err);
                }
            });
        });
    });
}