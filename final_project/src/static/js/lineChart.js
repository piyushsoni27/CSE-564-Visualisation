// https: //bl.ocks.org/EfratVil/92f894ac0ba265192411e73f633a3e2f
// https: //observablehq.com/@connor-roche/multi-line-chart-focus-context-w-mouseover-tooltip
//https://www.d3-graph-gallery.com/graph/bubble_template.html

var outerWidthLine = 960,
    outerHeightLine = 500 / 960 * outerWidthLine
var marginUpperLineChart = { top: 20, right: 20, bottom: 110, left: 40 }
var marginBottomLineChart = { top: 430, right: 20, bottom: 50, left: 40 }
var innerWidthLine = outerWidthLine - marginUpperLineChart.left - marginUpperLineChart.right - 10
var innerHeightLine = outerHeightLine - marginBottomLineChart.top - marginBottomLineChart.bottom - 10

var start_date
var end_date

function createLineChart(data, bubbledata) {
    var plotOuter = d3.select("svg#svgLineChart")
        .attr("width", outerWidthLine)
        .attr("height", outerHeightLine)

    svg = plotOuter
        .append('g')
        .attr('id', 'inner-plot')
        .attr('width', innerWidthLine)
        .attr('class', 'map')
        .attr('height', innerHeightLine)
        .attr('transform', 'translate(' + marginUpperLineChart.left + ',' + marginUpperLineChart.top + ')')

    margin = marginUpperLineChart,
        margin2 = marginBottomLineChart,
        width = outerWidthLine - margin.left - margin.right,
        height = outerHeightLine - margin.top - margin.bottom,
        height2 = outerHeightLine - margin2.top - margin2.bottom;

    var parseDate = d3.timeParse("%Y-%m-%d");

    data.forEach(d => {
        d.date = parseDate(d.date)
        d.numbers = +d.numbers
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

    //     'Case identification, contact tracing and related measures'
    //  'Social distancing' 'Travel restriction' 'Resource allocation'
    //  'Risk communication' 'Healthcare and public health capacity'
    //  'Returning to normal life'

    var linedata_max = d3.max(data, function(d) { return d.numbers; })
    var bubbledata_max = d3.max(bubbledata, function(d) { return d.Count; })
    var bubbledata_min = d3.min(bubbledata, function(d) { return d.Count; })

    var x = d3.scaleTime().range([0, width]),
        x2 = d3.scaleTime().range([0, width]),
        y = d3.scaleLinear().range([height, 0]),
        y2 = d3.scaleLinear().range([height2, 0]);
    // y = d3.scaleLog().range([height, 0]),
    // y2 = d3.scaleLog().range([height2, 0]);

    var xAxis = d3.axisBottom(x),
        xAxis2 = d3.axisBottom(x2),
        yAxis = d3.axisLeft(y);

    // Add a scale for bubble size
    var z = d3.scaleSqrt()
        .domain([bubbledata_min, bubbledata_max])
        .range([3, 30]);

    // Add a scale for bubble color
    var myColor = d3.scaleOrdinal()
        .domain(["Case identification, contact tracing and related measures", "Social distancing", "Travel restriction", "Resource allocation", "Risk communication", "Healthcare and public health capacity", "Returning to normal life"])
        .range(d3.schemeSet1);

    var brush = d3.brushX()
        .extent([
            [0, 0],
            [width, height2]
        ])
        .on("brush end", brushed);

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
        .on("zoom", zoomed);

    var line = d3
        .line()
        .x(d => x(d.date))
        .y(d => y(d.numbers));

    // create line for context chart
    var line2 = d3
        .line()
        .x(d => x2(d.date))
        .y(d => y2(d.numbers));

    var clip = svg.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", width)
        .attr("height", height)
        .attr("x", 0)
        .attr("y", 0);

    var Line_chart = svg.append("g")
        .attr("class", "focus")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("clip-path", "url(#clip)");

    var bubble_chart = svg.append("g")
        .attr("class", "focus")
        .attr("transform", "translate(" + (margin.left + 0) + "," + (margin.top + 0) + ")")
        .attr("clip-path", "url(#clip)");

    var focus = svg.append("g")
        .attr("class", "focus")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var context = svg.append("g")
        .attr("class", "context")
        .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

    x.domain(d3.extent(data, function(d) { return d.date; }));
    // y.domain((([1, 1000000000])
    y.domain([0, d3.max(data, function(d) { return d.numbers; })]);
    // y.domain([0, 10000]);
    x2.domain(x.domain());
    y2.domain(y.domain());

    focus.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    focus.append("g")
        .attr("class", "axis axis--y")
        .call(yAxis);

    focus.append("text")
        .attr("transform", "translate(" + width / 2 + " ," + (height + margin.top + 12) + ")")
        .style("text-anchor", "middle")
        .style("font-size", "18px")
        .text("Time");

    // focus chart y label
    focus.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "translate(" + (-margin.left - 10) + "," + height / 2 + ")rotate(-90)")
        .style("font-size", "18px")
        .text("Number of Cases (Logarithmic)");

    // var bucketNames = [];
    // for (let key of Object.keys(sumstat)) {
    //     bucketNames.push(sumstat[key].key);
    // }

    // match colors to bucket name
    // var colors = d3
    //     .scaleOrdinal()
    //     .domain(bucketNames)
    //     .range(["#3498db", "#3cab4b", "#e74c3c", "#73169e", "#2ecc71"]);

    // // go through data and create/append lines to both charts
    // for (let key of Object.keys(sumstat)) {
    //     let bucket = sumstat[key].values;
    //     Line_chart
    //         .append("path")
    //         .datum(bucket)
    //         .attr("class", "line")
    //         .attr("fill", "none")
    //         .attr("stroke", d => colors(sumstat[key].key))
    //         .attr("stroke-width", 4.5)
    //         .attr("d", line);
    //     context
    //         .append("path")
    //         .datum(bucket)
    //         .attr("class", "line")
    //         .attr("fill", "none")
    //         .attr("stroke", d => colors(sumstat[key].key))
    //         .attr("stroke-width", 1.5)
    //         .attr("d", line2);
    // }

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
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", 'black')
        .attr("stroke-width", 1.5)
        .attr("d", line2);

    bubble_chart.append("g")
        .selectAll("dot")
        .data(bubbledata)
        .enter()
        .append("circle")
        .attr("class", function(d) { return "bubbles " + d.Measure_L1 })
        .attr("cx", function(d) { return x(d.date); })
        .attr("cy", function(d) { return y((d.Count / bubbledata_max) * (linedata_max / 1.1)); })
        .attr("r", function(d) { return z(d.Count); })
        .style("fill", function(d) { return myColor(d.Measure_L1); })

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
        .attr("width", width)
        .attr("height", height)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(zoom);

    function brushed() {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
        var s = d3.event.selection || x2.range();
        start_date = s.map(x2.invert, x2)[0]
        end_date = s.map(x2.invert, x2)[1]
            // console.log("Brush 0 " + start_date)
            // console.log("Brush 1 " + end_date)
        x.domain(s.map(x2.invert, x2));
        Line_chart.selectAll(".line").attr("d", line);
        bubble_chart.selectAll(".bubbles")
            .attr("cx", function(d) { return x(d.date); })
            .attr("cy", function(d) { return y((d.Count / bubbledata_max) * (linedata_max / 1.1)); })
            .attr("r", function(d) { return z(d.Count); })
            .style("fill", function(d) { return myColor(d.Measure_L1); })
        focus.select(".axis--x").call(xAxis);
        focus.select(".axis--x").call(xAxis);
        svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
            .scale(width / (s[1] - s[0]))
            .translate(-s[0], 0));
    }

    function zoomed() {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
        var t = d3.event.transform;
        // console.log("Zoom 0 " + t.rescaleX(x2).domain()[0])
        // console.log("Zoom 1" + t.rescaleX(x2).domain()[1])
        x.domain(t.rescaleX(x2).domain());
        Line_chart.selectAll(".line").attr("d", line);
        bubble_chart.selectAll(".bubbles")
            .attr("cx", function(d) { return x(d.date); })
            .attr("cy", function(d) { return y((d.Count / bubbledata_max) * (linedata_max / 1.1)); })
            .attr("r", function(d) { return z(d.Count); })
            .style("fill", function(d) { return myColor(d.Measure_L1); })
        focus.select(".axis--x").call(xAxis);
        // console.log("t invert ", t.invertX);
        // console.log("t " + t);
        context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
    }

    function type(d) {
        d.date = parseDate(d.date);
        d.new_cases = +d.new_cases;
        return d;
    }
}