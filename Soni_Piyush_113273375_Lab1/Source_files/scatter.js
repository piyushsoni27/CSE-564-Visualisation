function setupScatter() {
    var data = data_global;
    // console.log("setupSelected")
    variables_global = Object.keys(data[0])
    
    // read current selections
    // let xvar = d3.select('select.xvar').property('value')
    // let yvar = d3.select('select.yvar').property('value')
    
    // if(yvar === "") return;

    var xvalues = data.map(d => parseFloat(d[xScattervar]));
    xmin = d3.min(xvalues);
    xmax = d3.max(xvalues);
    xScatterScale = d3
      .scaleLinear()
      .domain([xmin, xmax]) // get x variable from <select>
      .range([0, innerWidth])
      xScatterAxis = d3.axisBottom(xScatterScale).tickSize(-innerHeight)

    var yvalues = data.map(d => parseFloat(d[yScattervar]));
    ymin = d3.min(yvalues);
    ymax = d3.max(yvalues);
    yScatterScale = d3
      .scaleLinear()
      .domain(ymin, ymax) // get y variable from <select>
      .range([0, innerHeight].reverse())
    yScatterAxis = d3.axisLeft(yScatterScale).tickSize(-innerWidth)

    plotInnerScatter
    .append('g')
    .attr('transform', 'translate(' + 0 + ', ' + innerHeight + ')')
    .attr('class', 'x axis')
    .call(xScatterAxis)

    plotInnerScatter
    .append('g')
    .attr('class', 'y axis')
    .call(yScatterAxis)
    
    plotOuterScatter
    .append('text')
    .attr('class', 'x axis')
    .attr('x', margins.left + innerWidth / 2)
    .attr('y', outerHeight - margins.bottom / 2)
    .attr('text-anchor', 'middle')
    .text(longVars[xScattervar])

    plotOuterScatter
    .append('text')
    .attr('class', 'y axis')
    .attr('x', margins.left / 2)
    .attr('y', margins.bottom + innerHeight / 2)
    .attr('text-anchor', 'middle')
    .attr(
      'transform',
      `rotate(-90 ${margins.left / 2} ${margins.bottom + innerHeight / 2})`
    )
    .text(longVars[yScattervar])

  }

function updateScatter(){
    var data = data_global;
    // xvar = d3.select('select.xvar').property('value')
    // yvar = d3.select('select.yvar').property('value')

    var xvalues = data.map(d => parseFloat(d[xScattervar]));
    xmin = d3.min(xvalues);
    xmax = d3.max(xvalues);  
    xScatterScale.domain([xmin, xmax])
    var xValue = function(d) { return d[xScattervar]}
    var xMap = function(d) { return xScatterScale(xValue(d));}

    var yvalues = data.map(d => parseFloat(d[yScattervar]));
    ymin = d3.min(yvalues);
    ymax = d3.max(yvalues);
    yScatterScale.domain([ymin, ymax])
    var yValue = function(d) { return d[yScattervar]}
    var yMap = function(d) { return yScatterScale(yValue(d));}


    // update axes
    plotInnerScatter
        .select('.x.axis')
        .transition()
        .duration(transitionTime)
        .call(xScatterAxis)

    plotInnerScatter
        .select('.y.axis')
        .transition()
        .duration(transitionTime)
        .call(yScatterAxis)

 // axis labels
    plotOuterScatter
        .selectAll('text.y.axis') // select text elements with two both classes
        .transition()
        .duration(transitionTime)
        .text(longVars[yScattervar])

    plotOuterScatter
        .selectAll('text.x.axis')
        .transition()
        .duration(transitionTime)
        .text(longVars[xScattervar])

// main plot
// D3 automatically adds elements corresponding to newly added data (enter selection), 
// re-orders elements corresponding to already-existing data (update selection) and 
// removes elements corresponding to data that no longer exists (exit selection).

plotInnerScatter
  .selectAll('circle')
    .data(data)
    .join(
      enter =>
        enter
            .append('circle')
            .attr('cx', xMap)
            .attr('cy', yMap)
            .attr('r', 4)
            .style('fill', 'blue')
            .style('opacity', 0.6)
            .on("mouseover", function(d) {
                d3.select(this).style("fill", "red").attr('r', 6);
            })
            .on("mouseout", function(d) {
                d3.select(this).style("fill", "blue").style('opacity', 0.6).attr('r', 4);
            }),
      update =>
        update
            .transition()
            .duration(transitionTime)
            .attr('cx', xMap)
            .attr('cy', yMap)
            .attr('r', 4),
      exit =>
        exit
          .transition()
          .duration(transitionTime)
          .remove()
    )
    
}
