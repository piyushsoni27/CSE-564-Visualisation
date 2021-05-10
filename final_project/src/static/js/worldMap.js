// http://bl.ocks.org/micahstubbs/8e15870eb432a21f0bc4d3d527b2d14f
// https://jsfiddle.net/mamounothman/04t6wmya/4/
// https://bl.ocks.org/wboykinm/dbbe50d1023f90d4e241712395c27fb3

var outerWidthWorld = 900, outerHeightWorld = 450/960 * outerWidthWorld
var marginsWorld = { top: 10, bottom: 10, left: 10, right: 10 }
var innerWidthWorld = outerWidthWorld - marginsWorld.left - marginsWorld.right
var innerHeightWorld = outerHeightWorld - marginsWorld.top - marginsWorld.bottom

function worldMap(dataset, attr) {
    // console.log(dataset)
    // Set tooltips
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            var attr_str = "";
            if(attr === "new_cases"){
                attr_str = "New Cases"
            }
            else if(attr === "new_deaths"){
                attr_str = "New Deaths"
            } else if(attr === "new_vaccinates"){
                attr_str = "New Vaccinations"
            }
            return "<strong>Country: </strong><span class='details'>" + d.properties.name + "<br></span>" + "<strong>" + attr_str + ": </strong><span class='details'>" + d[attr] + "</span>";
        })

    tip.direction(function(d) {
        if (d.properties.name === 'Antarctica') return 'n'
        // Americas
        if (d.properties.name === 'Greenland') return 's'
        if (d.properties.name === 'Canada') return 'e'
        if (d.properties.name === 'United States of America') return 'e'
        if (d.properties.name === 'Mexico') return 'e'
        // Europe
        if (d.properties.name === 'Iceland') return 's'
        if (d.properties.name === 'Norway') return 's'
        if (d.properties.name === 'Sweden') return 's'
        if (d.properties.name === 'Finland') return 's'
        if (d.properties.name === 'Russia') return 'w'
        // Asia
        if (d.properties.name === 'China') return 'w'
        if (d.properties.name === 'Japan') return 's'
        // Oceania
        if (d.properties.name === 'Indonesia') return 'w'
        if (d.properties.name === 'Papua New Guinea') return 'w'
        if (d.properties.name === 'Australia') return 'w'
        if (d.properties.name === 'New Zealand') return 'w'
        // otherwise if not specified
        return 'n'
        })

        tip.offset(function(d) {
            // [top, left]
            if (d.properties.name === 'Antarctica') return [0, 0]
            // Americas
            if (d.properties.name === 'Greenland') return [10, -10]
            if (d.properties.name === 'Canada') return [24, -28]
            if (d.properties.name === 'USA') return [-5, 8]
            if (d.properties.name === 'Mexico') return [12, 10]
            if (d.properties.name === 'Chile') return [0, -15]
            // Europe
            if (d.properties.name === 'Iceland') return [15, 0]
            if (d.properties.name === 'Norway') return [10, -28]
            if (d.properties.name === 'Sweden') return [10, -8]
            if (d.properties.name === 'Finland') return [10, 0]
            if (d.properties.name === 'France') return [-9, 66]
            if (d.properties.name === 'Italy') return [-8, -6]
            if (d.properties.name === 'Russia') return [5, 385]
            // Africa
            if (d.properties.name === 'Madagascar') return [-10, 10]
            // Asia
            if (d.properties.name === 'China') return [-16, -8]
            if (d.properties.name === 'Mongolia') return [-5, 0]
            if (d.properties.name === 'Pakistan') return [-10, 13]
            if (d.properties.name === 'India') return [-11, -18]
            if (d.properties.name === 'Nepal') return [-8, 1]
            if (d.properties.name === 'Myanmar') return [-12, 0]
            if (d.properties.name === 'Laos') return [-12, -8]
            if (d.properties.name === 'Vietnam') return [-12, -4]
            if (d.properties.name === 'Japan') return [5, 5]
            // Oceania
            if (d.properties.name === 'Indonesia') return [0, -5]
            if (d.properties.name === 'Papua New Guinea') return [-5, -10]
            if (d.properties.name === 'Australia') return [-15, 0]
            if (d.properties.name === 'New Zealand') return [-15, 0]
            // otherwise if not specified
            return [-10, 0]
        })
    
    var max = d3.max(dataset.features, function(d){ return +d[attr] }) 
    var min = d3.min(dataset.features, function(d){ return +d[attr] })
    
    var lowColor = '#f9f9f9'
    var highColor = '#bc2a66'
    
    var ramp = d3.scaleLinear().domain([min,max]).range([lowColor,highColor])

    // var color = d3.scaleThreshold()
	// .domain([0, 10, 100, 1000, 5000, 10000, 15000, 20000, 40000, 60000, 80000])
	// // .range(["#fff7bc", "#fee391", "#fec44f", "#fe9929", "#ec7014", "#cc4c02", "#993404", "#662506"]);
    // .range(["rgb(255,251,247)", "rgb(247,235,222)", "rgb(239,219,198)", "rgb(225,202,158)", "rgb(214,174,107)", "rgb(198,146,66)", "rgb(181,113,33)", "rgb(156,81,8)", "rgb(107,48,8)", "rgb(43,19,3)"]);
    console.log(innerWidthWorld)
    const logScale = d3.scaleLog()
      .domain([min, max])
    const color = d3.scaleSequential(
        (d) => d3.interpolateReds(logScale(d))
      )

    var plotOuter = d3.select("svg#svgWorldMap")
                    .attr("width", outerWidthWorld)
                    .attr("height", outerHeightWorld)

    plotInner = plotOuter
                    .append('g')
                    .attr('id', 'inner-plot')
                    .attr('width', innerWidthWorld)
                    .attr('class', 'map')
                    .attr('height', innerHeightWorld)
                    .attr('transform', 'translate(' + marginsWorld.left + ',' + marginsWorld.top + ')')

    var projection = d3.geoMercator()
        .scale(150,80)
        .translate([innerWidthWorld / 2, innerHeightWorld / 1.5]);

    var path = d3.geoPath().projection(projection);

    plotInner.call(tip);

    plotInner.append("g")
        .attr("class", "countries")
        .selectAll("path")
        .data(dataset.features)
        .enter().append("path")
        .attr("d", path)
        .style("fill", function(d) { return ramp(d[attr]) })
        .style('stroke', 'white')
        .style('stroke-width', 1.5)
        .style("opacity", 0.8)
        // tooltips
        .style("stroke", "white")
        .style('stroke-width', 0.3)
        .on('mouseover', function(d) {
            if(String(+d[attr]) !== "NaN") tip.show(d);

            d3.select(this)
                .style("opacity", 1)
                .style("stroke", "white")
                .style("stroke-width", 3);
        })
        .on('mouseout', function(d) {
            tip.hide(d);

            d3.select(this)
                .style("opacity", 0.8)
                .style("stroke", "white")
                .style("stroke-width", 0.3);
        });

        plotInner.append("path")
        .datum(topojson.mesh(dataset.features, function(a, b) {
            return a.id !== b.id;
        }))
        .attr("class", "names")
        .attr("d", path);

        // // add a legend
		// var w = 140, h = 300;

		// var key = d3.select("#worldmap")
		// 	.append("svg")
		// 	.attr("width", w)
		// 	.attr("height", h)
		// 	.attr("class", "legend");

		// var legend = key.append("defs")
		// 	.append("svg:linearGradient")
		// 	.attr("id", "gradient")
		// 	.attr("x1", "100%")
		// 	.attr("y1", "0%")
		// 	.attr("x2", "100%")
		// 	.attr("y2", "100%")
		// 	.attr("spreadMethod", "pad");

		// legend.append("stop")
		// 	.attr("offset", "0%")
		// 	.attr("stop-color", highColor)
		// 	.attr("stop-opacity", 1);
			
		// legend.append("stop")
		// 	.attr("offset", "100%")
		// 	.attr("stop-color", lowColor)
		// 	.attr("stop-opacity", 1);

		// key.append("rect")
		// 	.attr("width", w - 100)
		// 	.attr("height", h)
		// 	.style("fill", "url(#gradient)")
		// 	.attr("transform", "translate(0,10)");

		// var y = d3.scaleLinear()
		// 	.range([h, 0])
		// 	.domain([min, max]);

		// var yAxis = d3.axisRight(y);

		// key.append("g")
		// 	.attr("class", "y axis")
		// 	.attr("transform", "translate(41,10)")
		// 	.call(yAxis)
}