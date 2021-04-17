function calcBar(values){
    var bar = values.reduce((acc, curr) => {
        const foundObject = acc.find(e => e.key === curr);
        if (foundObject) ++foundObject.count;
        else acc.push({
          key: curr,
          count: 1
        });
        return acc;
      }, []);

      return bar;
}

function setupBar() {
    var data = data_global;
    
    var values = data.map(d => d[xvar]);

    var barData = calcBar(values)
    
    xCatScale = d3
      .scaleBand()
      .domain(barData.map(function(d) {
        return d.key;
      }))
      .rangeRound([0, innerWidth])
      .paddingInner(0.2)
      .paddingOuter(0.1)
    //   .range([0, innerWidth])
      xCatAxis = d3.axisBottom(xCatScale)

    // set the parameters for the histogram
    ymax = d3.max(barData, function(d){return d.count});
    yCatScale = d3
        .scaleLinear()
        .domain([0, ymax]) // get y variable from <select>
        .range([innerHeight, 0])
    yCatAxis = d3.axisLeft(yCatScale)

    plotInnerBar
    .append('g')
    .attr('transform', 'translate(' + 0 + ', ' + innerHeight + ')')
    .attr('class', 'x axis') // note: two classes; handy!
    .call(xCatAxis)

    plotInnerBar
    .append('g')
    .attr('class', 'y axis')
    .call(yCatAxis)
    
    plotOuterBar
    .append('text')
    .attr('class', 'x axis')
    .attr('x', margins.left + innerWidth / 2)
    .attr('y', outerHeight - margins.bottom / 2)
    .attr('text-anchor', 'middle')
    .text(longVars[xvar])

    plotOuterBar
    .append('text')
    .attr('class', 'y axis')
    .attr('x', margins.left / 2)
    .attr('y', margins.bottom + innerHeight / 2)
    .attr('text-anchor', 'middle')
    .attr(
      'transform',
      `rotate(-90 ${margins.left / 2} ${margins.bottom + innerHeight / 2})`
    )
    .text("Frequency")

  }

function updateBar(){
    var data = data_global;

    var values = data.map(d => d[xvar]);
    // console.log(values)

    var barData = calcBar(values);

    // update scales
    xCatScale.domain(barData.map(function(d) {
        return d.key;
      }));

    ymax = d3.max(barData, function(d){return d.count});
    yCatScale.domain([0, ymax + 10])

    // update axes
    plotInnerBar
        .select('.x.axis')
        .transition()
        .duration(transitionTime)
        .call(xCatAxis)
    plotInnerBar
        .select('.y.axis')
        .transition()
        .duration(transitionTime)
        .call(yCatAxis)

 // axis labels
    plotOuterBar
        .selectAll('text.y.axis') // select text elements with two both classes
        .transition()
        .duration(transitionTime)

    plotOuterBar
        .selectAll('text.x.axis')
        .transition()
        .duration(transitionTime)
        .text(longVars[xvar])

    var my_group = plotInnerBar.selectAll(".chart_group")
                    .data(barData)
                    .join(function(group){
                        var enter = group.append("g").attr("class","chart_group");
                        enter.append("rect").attr("class","group_rect");
                        enter.append("text").attr("class","group_text");
                        return enter;
                    })
    
    my_group.exit().transition()
                .duration(transitionTime).remove();

    var enter = my_group.enter()
        .append("g")
        .attr("class", "data_group");

    my_group.select(".group_rect")
        .on('mouseover', handleMouseOver)
        .on('mouseout', handleMouseOut)
        .transition()
        .duration(transitionTime)
        .attr('x', function(d) {
                return xCatScale(d.key);
            })
        .attr("width", xCatScale.bandwidth())
        .attr("y", function(d) {
            return yCatScale(d.count) + 2;
        })
        .attr("height", function(d) {
            return innerHeight - yCatScale(d.count);
        })
        .style('fill', 'blue')
        .style('opacity', 0.6)
        
    //then position text
    my_group.select(".group_text")
        .attr("x", function(d) {
            return xCatScale(d.key) + xCatScale.bandwidth()/2;
        })
        .attr("y", function(d) {
                return yCatScale(d.count + 2);
        })
        .style("visibility", "hidden")
        .attr("text-anchor","middle")
        .text(function(d) { return d.count; });
                        
    function handleMouseOver(){
        var txt = d3.select(this.nextSibling)
        txt.style('visibility','visible').style('fill', 'red')
        d3.select(this).style('fill', 'red')
        .style('opacity', 0.6)
    }

    function handleMouseOut(){
        var txt = d3.select(this.nextSibling)
        txt.style('visibility','hidden')
        d3.select(this).style('fill', 'blue')
        .style('opacity', 0.6)
    }
    
}