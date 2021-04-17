var outerWidthBar = 850, outerHeightBar = 5/6 * outerWidthBar
var innerWidthBar = outerWidthBar - margins.left - margins.right - 10
var innerHeightBar = outerHeightBar - margins.top - margins.bottom - 10

function biPlot(biplot_data, axis_data){
    biplot_val = biplot_data

    var plotOuter = d3.select("svg#svgbiplot")
                    .attr("width", outerWidthBar)
                    .attr("height", outerHeightBar)

    plotInner = plotOuter
                    .append('g')
                    .attr('id', 'inner-plot')
                    .attr('width', innerWidthBar)
                    .attr('height', innerHeightBar)
                    .attr('transform', 'translate(' + margins.left + ',' + margins.top + ')')


    var xScale = d3.scaleLinear().range ([0, innerWidthBar]),
        yScale = d3.scaleLinear().range ([innerHeightBar, 0]);

    xScale.domain([d3.min(biplot_data, function(d){ return d.x }), d3.max(biplot_data, function(d){ return d.x })]);
    yScale.domain([d3.min(biplot_data, function(d){ return d.y }), d3.max(biplot_data, function(d){ return d.y })]);

    plotInner.append("g")
        .attr("transform", "translate(0," + innerHeightBar/2 + ")")
        .call(d3.axisBottom(xScale))
        .append("text")
        .attr("y", margins.bottom / 2)
        .attr("x", innerWidthBar)
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .attr("fill", "black")
        .text("PC1")
        .attr("font-size", "15px");

    plotInner.append("g")
        .attr("transform", "translate(" + innerWidthBar/2 + ", 0)")
        .call(d3.axisLeft(yScale))
        .append("text")
        .attr("transform", "rotate(-90)", "translate(0," + innerWidthBar/2 + ")")
        .attr("y", margins.left - 10)
        .attr("x", - margins.top / 2 )
        .attr("dy", "-5.1em")
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .attr("fill", "black")
        .text("PC2")
        .attr("font-size", "15px");

    plotOuter.append("text")
        .attr("x", outerWidthBar/2 - margins.right)
        .attr("y", margins.top/2)
        .attr("font-size", "24px")
        .text("Bi-plot")

    var points = plotInner.selectAll("circles")
        .data(biplot_data)
        .enter()
        .append("circle")
        .attr("class", "point")
        .attr("cx", function(d) { return xScale(d.x); })
        .attr("cy", function(d) { return yScale(d.y); })
        .attr("r", 2)
        .attr("fill", "blue")
        .on("mouseover", function(d) {
            d3.select(this).style("fill", "red")
                            .attr('r', 4)
        })
        .on("mouseout", function(d){
            d3.select(this).style("fill", "blue")
                            .attr('r', 2)
        })

    plotInner.selectAll("lines")
            .data(axis_data)
            .enter()
            .append("line")
            .attr("x1", xScale(0))
            .attr("y1", yScale(0))
            .attr("x2", function(d) { return xScale(d.x); })
            .attr("y2", function(d) { return yScale(d.y); })
            .style("stroke", "orange")
            .style("stroke-width", 2)
            .on("mouseover", function(d) {
                d3.select(this).style("stroke", "green")
                                .style("stroke-width", 5)
            })
            .on("mouseout", function(d){
                d3.select(this).style("stroke", "orange")
                                .style("stroke-width", 2)
            })
        
    plotInner.selectAll("lines")
            .data(axis_data)
            .enter()
            .append("text")
            .text(function(d){ return d.labels; })
            .attr("x", function(d) { return xScale(d.x); })
            .attr("y", function(d) { return yScale(d.y); })
            .style("font-weight", "bold")
}