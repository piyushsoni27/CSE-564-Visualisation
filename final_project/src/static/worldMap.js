var outerWidthWorld = 500, outerHeightWorld = 5/6 * outerWidthWorld
var marginsWorld = { top: 60, bottom: 60, left: 60, right: 10 }
var innerWidth = outerWidthWorld - marginsWorld.left - marginsWorld.right - 10
var innerHeight = outerHeightWorld - marginsWorld.top - marginsWorld.bottom - 10

function worldMap(world_data, attr){
    // https://www.d3-graph-gallery.com/graph/choropleth_basic.html



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
                        .translate([width / 2, height / 2]);

    // Data and color scale
    var data = d3.map();
    var colorScale = d3.scaleThreshold()
                            .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
                            .range(d3.schemeBlues[7]);

    // Draw the map
    plotInner.append("g")
        .selectAll("path")
        .data(topo.features)
        .enter()
        .append("path")
        // draw each country
        .attr("d", d3.geoPath()
            .projection(projection)
        )
        // set the color of each country
        .attr("fill", function (d) {
            d.total = data.get(d.id) || 0;
            return colorScale(d.total);
        });
}