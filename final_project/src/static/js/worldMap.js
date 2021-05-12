// http://bl.ocks.org/micahstubbs/8e15870eb432a21f0bc4d3d527b2d14f
// https://jsfiddle.net/mamounothman/04t6wmya/4/
// https://bl.ocks.org/wboykinm/dbbe50d1023f90d4e241712395c27fb3

var outerWidthWorld = 760,
    outerHeightWorld = 450 / 760 * outerWidthWorld
var marginsWorld = { top: 5, bottom: 20, left: 5, right: 20 }
var innerWidthWorld = outerWidthWorld - marginsWorld.left - marginsWorld.right
var innerHeightWorld = outerHeightWorld - marginsWorld.top - marginsWorld.bottom

function worldMap(dataset, attr, countries) {
    // console.log(dataset)
    // Set tooltips
    document.getElementById("worldmap").innerHTML = "";

    var plotOuter = d3.select("#worldmap")
        .append("svg")
        .attr("width", outerWidthWorld)
        .attr("height", outerHeightWorld)
        .attr('transform', 'translate(20,20)')

    plotInner = plotOuter
        .append('g')
        .attr('id', 'inner-plot')
        .attr('width', innerWidthWorld)
        .attr('class', 'map')
        .attr('height', innerHeightWorld)
        .attr('transform', 'translate(' + marginsWorld.left + ',' + marginsWorld.top + ')')

    var projection = d3.geoNaturalEarth()
        .scale(innerWidthWorld / Math.PI / 1.5)
        .translate([innerWidthWorld / 2, innerHeightWorld / 2]);

    var path = d3.geoPath().projection(projection);

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            var attr_str = "";
            if (attr === "new_cases") {
                attr_str = "New Cases"
            } else if (attr === "new_deaths") {
                attr_str = "New Deaths"
            } else if (attr === "new_vaccinations") {
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

    plotInner.call(tip);

    plotInner.append("g")
        .attr("class", "countries")
        .selectAll("path")
        .data(dataset.features)
        .enter()
        .append("path")
        .attr("d", path)

    // Legend
    var g = plotOuter.append("g")
        .attr("class", "legendThreshold")
        .attr("transform", "translate(20,300)");

    g.append("text")
        .attr("class", "caption")
        .attr("x", 0)
        .attr("y", -6)
        .text(attr)
        .attr("fill", "white")



    function checkCountry(s) {
        // console.log(s)
        for (i = 0; i < countries.length; i++) {
            if (countries[i] === s) {
                return true;
            }
        }
        return false;
    }

    function updateWorldMap(dataset){

        var max = d3.max(dataset.features, function(d) { return +d[attr] })
        var min = d3.min(dataset.features, function(d) { return +d[attr] })
    
        var step = Math.ceil((max - min) / 6)
        var legends_arr = [];
        var labels = []
        var num;

        legends_arr.push(min)
        
        for (i = 1; i < 6; i++) {
            num = min + step * i
            legends_arr.push(num)
            if (num >= 1000000) {
                labels.push((legends_arr[i - 1] + 1).toString() + "-" + Math.ceil(num / 1000000).toString() + 'M')
            } else {
                labels.push((legends_arr[i - 1] + 1).toString() + "-" + num.toString())
            }
        }
        
        if (legends_arr[i - 1] >= 1000000) {
            labels.push("> " + Math.ceil(legends_arr[i - 1] / 1000000).toString() + 'M')
        } else {
            labels.push("> " + (legends_arr[i - 1] + 1).toString())
        }

        var colorScheme = d3.schemeReds[5];
        var colorScale = d3.scaleSqrt()
            .domain(legends_arr)
            .range(colorScheme);

        var legend = d3.legendColor()
                        .labels(function(d) { return labels[d.i]; })
                        .shapePadding(4)
                        .scale(colorScale);

        plotOuter.select(".legendThreshold")
            .call(legend);
        
        plotInner.selectAll("path")
            .data(dataset.features)
            .style("fill", function(d) {
                if (String(+d[attr]) === "NaN" || !checkCountry(d.properties.name)) {
                    return "gray"
                }
                return colorScale(d[attr])
            })
            .style('stroke', 'white')
            .style('stroke-width', 1.5)
            .style("opacity", 0.8)
            // tooltips
            .style("stroke", "white")
            .style('stroke-width', 0.3)
            .on('mouseover', function(d) {
                if (String(+d[attr]) !== "NaN") tip.show(d);

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
            })
            .on('click', function(d) {
                if (String(+d[attr]) !== "NaN") {
                    worldmap_country = d.id;

                    worldMapTrigger.a = d.id

                    d3.select(this)
                        .style("opacity", 1)
                        .style("stroke", "white")
                        .style("stroke-width", 3);
                } else {
                    worldmap_country = "world"
                    worldMapTrigger.a = "world"
                }
                tip.hide()
            });
    }
    updateWorldMap(dataset)

    lineChartTrigger.registerListener(function(val) {
        dates = {}
        dates.start = selected_start_date
        dates.end = selected_end_date
        
        $(document).ready(function() {
            console.log(dates)
            $.ajax({
                type: "POST",
                url: "/worldmap",
                contentType: "application/json",
                data: JSON.stringify(dates),
                dataType: "json",
                success: function(response) {
                    worldData = (response)

                    updateWorldMap(worldData)
                },
                error: function(err) {
                    console.log(err);
                }
            });
        });

        $(document).ready(function() {
            $.ajax({
                type: "POST",
                url: "/wordcloud",
                contentType: "application/json",
                data: JSON.stringify(dates),
                dataType: "json",
                success: function(response) {
                    wordCloudData = (response)

                    createWordCloud(wordCloudData)
                },
                error: function(err) {
                    console.log(err);
                }
            });
        });
    });

}

