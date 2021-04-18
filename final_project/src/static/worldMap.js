var outerWidthWorld = 500, outerHeightWorld = 5/6 * outerWidthWorld
var marginsWorld = { top: 60, bottom: 60, left: 60, right: 10 }
var innerWidth = outerWidthWorld - marginsWorld.left - marginsWorld.right - 10
var innerHeight = outerHeightWorld - marginsWorld.top - marginsWorld.bottom - 10

function worldMap(world_data, attr){
    // https://www.d3-graph-gallery.com/graph/choropleth_basic.html
    // https://towardsdatascience.com/using-d3-js-to-create-dynamic-maps-and-visuals-that-show-competing-climate-change-scenarios-for-bb0515d633d3

    // var total_cases = world_data.map(function (e) {
    //     return e.new_cases; })

    console.log(total_cases)

    var plotOuter = d3.select("svg#svgWorldMap")
                    .attr("width", outerWidthWorld)
                    .attr("height", outerHeightWorld)

    plotInner = plotOuter
                    .append('g')
                    .attr('id', 'inner-plot')
                    .attr('width', innerWidth)
                    .attr('height', innerHeight)
                    .attr('transform', 'translate(' + marginsWorld.left + ',' + marginsWorld.top + ')')
    
    // Map and projection
    var path = d3.geoPath();
    var projection = d3.geoMercator()
                        .scale(70)
                        .center([0,20])
                        .translate([innerWidth / 2, innerHeight / 2]);

    // Data and color scale
    var data = d3.map();
    var colorScale = d3.scaleThreshold()
                            .domain(d3.extent(world_data, function(d){ return d.new_cases; }))
                            .range(d3.schemeBlues[7]);

    // Draw the map
    plotInner.append("g")
        .selectAll("path")
        .data(world_data)
        .enter()
        .append("path")
        // draw each country
        .attr("d", d3.geoPath()
            .projection(projection)
        )
        // set the color of each country
        .attr("fill", function (d) {
            d.total = data.get(d.iso_code) || 0;
            return colorScale(d.new_cases);
        });
}