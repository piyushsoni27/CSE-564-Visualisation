var bins;
var dragTransition = 100, dragStart = 0;

function setupHist() {
      var data = data_global;
  
      var values = data.map(d => parseFloat(d[xvar]));
  
      xmin = d3.min(values);
      xmax = d3.max(values);
      xScale = d3
        .scaleLinear()
        .domain([0, xmax]) // get x variable from <select>
        .range([0, innerWidth])
        xAxis = d3.axisBottom(xScale)
  
      // set the parameters for the histogram
      var bins = d3.histogram()
                      .domain(xScale.domain())  // then the domain of the graphic
                      .thresholds(xScale.ticks(10)) // then the numbers of bins
                      (values);
        
      ymax = d3.max(bins, function(d){return d.length});
      yScale = d3
          .scaleLinear()
          .domain([0, ymax])
          .range([innerHeight, 0])
      yAxis = d3.axisLeft(yScale)
  
      plotInnerHist
      .append('g')
      .attr('transform', 'translate(' + 0 + ', ' + innerHeight + ')')
      .attr('class', 'x axis') 
      .call(xAxis)
  
      plotInnerHist
      .append('g')
      .attr('class', 'y axis')
      .call(yAxis)
      
      plotOuterHist
      .append('text')
      .attr('class', 'x axis')
      .attr('x', margins.left + innerWidth / 2)
      .attr('y', outerHeight - margins.bottom / 2)
      .attr('text-anchor', 'middle')
      .text(longVars[xvar])
  
      plotOuterHist
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
  


function updateAxis(binCount, transitionTimeLocal){
    var data = data_global;

    var values = data.map(d => parseFloat(d[xvar]));

    // // update scales
    xmin = d3.min(values);
    xmax = d3.max(values);
    
    xScale = d3
        .scaleLinear()
        .domain([0, xmax]) // get x variable from <select>
        .range([0, innerWidth])
    xAxis = d3.axisBottom(xScale)

    // set the parameters for the histogram
    bins = d3.histogram()
                    .domain(xScale.domain())  // then the domain of the graphic
                    .thresholds(xScale.ticks(binCount)) // then the numbers of bins
                    (values);
        // console.log(bins)
    ymax = d3.max(bins, function(d){return d.length});
    yScale = d3
        .scaleLinear()
        .domain([0, ymax]) // get y variable from <select>
        .range([innerHeight, 0])
    yAxis = d3.axisLeft(yScale)

    plotInnerHist
        .select('.x.axis')
        .transition()
        .duration(transitionTimeLocal)
        .call(xAxis)
    plotInnerHist
        .select('.y.axis')
        .transition()
        .duration(transitionTimeLocal)
        .call(yAxis)

// axis labels
    plotOuterHist
        .selectAll('text.y.axis') // select text elements with two both classes
        .transition()
        .duration(transitionTimeLocal)

    plotOuterHist
        .selectAll('text.x.axis')
        .transition()
        .duration(transitionTimeLocal)
        .text(longVars[xvar])
}

function updateGraph(transitionTimeLocal){
    var my_group = plotInnerHist.selectAll(".chart_group")
                    .data(bins)
                    .join(function(group){
                        var enter = group.append("g").attr("class","chart_group");
                        enter.append("rect").attr("class","group_rect");
                        enter.append("text").attr("class","group_text");
                        return enter;
                    })

    my_group.exit().remove();

    var enter = my_group.enter()
        .append("g")
        .attr("class", "data_group");

    my_group.select(".group_rect")
    .on('mouseover', handleMouseOver)
    .on('mouseout', handleMouseOut)
        .transition()
        .duration(transitionTimeLocal)
        .attr("transform", function(d) { return "translate(" + xScale(d.x0) + "," + yScale(d.length) + ")"; })
        .attr("width", function(d) { return xScale(d.x1) - xScale(d.x0) ; })
        .attr("height", function(d) { return innerHeight - yScale(d.length); })
        .style('fill', 'blue')
        .style('opacity', 0.6)
        

    //then position text
    my_group.select(".group_text")
        .attr("x", function(d) {
            return (xScale(d.x0)+ xScale(d.x1))/2;
        })
        .attr("y", function(d) {
                return yScale(d.length + 1);
        })
        .style("visibility", "hidden")
        .attr("text-anchor","middle")
        .text(function(d) { return d.length; });
                        
    function handleMouseOver(){
        var txt = d3.select(this.nextSibling)
        txt.style('visibility','visible').style('fill', 'red')
        d3.select(this).style('fill', 'red')
        .style('opacity', 0.6)
        .attr("width", function(d) { return xScale(d.x1) - xScale(d.x0) +2 ; })
        .attr("height", function(d) { return innerHeight - yScale(d.length) +1; })
    }

    function handleMouseOut(){
        var txt = d3.select(this.nextSibling)
        txt.style('visibility','hidden')
        d3.select(this).style('fill', 'blue')
        .style('opacity', 0.6)
    }
}

function updateHist(){
    var binCount = 10
    var data = data_global;
    var values = data.map(d => d[xvar]);
    var maxBins = 100;

    var min = d3.min(values)
    var max = d3.max(values)

    var thresholds = d3.range(min, max, (max - min)/(binCount))

    var binDiff = 0;
    
    var dragHandler = d3.drag()
    .on("start", function () {
    if (d3.event.defaultPrevented) return; // click suppressed
        dragStart = d3.event.x;
    })
    .on("drag", function () {

            binDiff = ((dragStart - d3.event.x)/ 40);

            binCount = binCount + binDiff;

            if(binCount < 1) binCount = 1;
            if(binCount > maxBins) binCount = maxBins ;

            // set the parameters for the histogram
            var bins = d3.histogram()
                    .domain(xScale.domain())  // then the domain of the graphic
                    .thresholds(thresholds) // then the numbers of bins
                    // .thresholds(xScale.ticks(binCount)) // then the numbers of bins
                    (values);
            
            updateAxis(binCount, dragTransition);
            updateGraph(dragTransition);
    })
    .on("end", function () {
        
    });

    d3.select("svg#global").call(dragHandler); 

    updateAxis(binCount, transitionTime);
    updateGraph(transitionTime); 
}