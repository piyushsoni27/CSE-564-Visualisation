var outerWidthMDSEuc = 800, outerHeightMDSEuc = 5/6 * outerWidthMDSEuc
var innerWidthMDSEuc = outerWidthMDSEuc - margins.left - margins.right - 10
var innerHeightMDSEuc = outerHeightMDSEuc - margins.top - margins.bottom - 10

function plot_mds_euc(mds_euc_data){
    
    var plotOuter = d3.select("svg#svgMDSEUCplot")
                    .attr("width", outerWidthMDSEuc)
                    .attr("height", outerHeightMDSEuc)

    plotInner = plotOuter
                    .append('g')
                    .attr('id', 'inner-plot')
                    .attr('width', innerWidthMDSEuc)
                    .attr('height', innerHeightMDSEuc)
                    .attr('transform', 'translate(' + margins.left + ',' + margins.top + ')')


    var xScale = d3.scaleLinear().range ([0, innerWidthMDSEuc]),
        yScale = d3.scaleLinear().range ([innerHeightMDSEuc, 0]);
    
    var color = d3.scaleOrdinal(d3.schemeCategory10);

    xScale.domain([d3.min(mds_euc_data, function(d){ return d.x }), d3.max(mds_euc_data, function(d){ return d.x })]);
    yScale.domain([d3.min(mds_euc_data, function(d){ return d.y }), d3.max(mds_euc_data, function(d){ return d.y })]);

    plotInner.append("g")
        .attr("transform", "translate(0," + innerHeightMDSEuc + ")")
        .call(d3.axisBottom(xScale))
        .append("text")
        .attr("y", margins.bottom / 2)
        .attr("x", innerWidthMDSEuc)
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .attr("fill", "black")
        .text("DIM-1")
        .attr("font-size", "15px");

    plotInner.append("g")
        .attr("transform", "translate(" + 0 + ", 0)")
        .call(d3.axisLeft(yScale))
        .append("text")
        .attr("transform", "rotate(-90)", "translate(0," + innerWidthMDSEuc/2 + ")")
        .attr("y", margins.left - 10)
        .attr("x", - margins.top / 2 )
        .attr("dy", "-5.1em")
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .attr("fill", "black")
        .text("DIM-2")
        .attr("font-size", "15px");

    plotOuter.append("text")
        .attr("x", outerWidthMDSEuc/2 - margins.right - 100)
        .attr("y", margins.top/2)
        .attr("font-size", "24px")
        .text("Data MDS-Plot (Euclidean Dist)")

    var points = plotInner.selectAll("circles")
        .data(mds_euc_data)
        .enter()
        .append("circle")
        .attr("class", "point")
        .attr("cx", function(d) { return xScale(d.x); })
        .attr("cy", function(d) { return yScale(d.y); })
        .attr("r", 4)
        .attr("fill", "blue")
        .style("fill", function(d) { return color(d.cluster); })
        .on("mouseover", function(d) {
            d3.select(this).style("fill", "red")
                            .attr('r', 6)
        })
        .on("mouseout", function(d){
            d3.select(this).style("fill", function(d) { return color(d.cluster); })
                            .attr('r', 4)
        })
}