function constructTable(list, selector) { 
   
    // Getting the all column names 
    var table = document.getElementById(selector);
    table.innerHTML = ""
    var row = table.insertRow(0)
    row.insertCell(0).outerHTML = "<th>Top Atrributes</th>"
    row.insertCell(1).outerHTML = "<th>Sum of Squared loadings</th>"
    for (var key of Object.keys(list)) {
        var row = table.insertRow(-1);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        cell1.innerHTML = key;
        cell2.innerHTML = list[key];
    }
} 

function screePlot(pca_data){
    // console.log(pca_data)
    pca_val = pca_data
    var data_len = Object.keys(pca_data).length

    var plotOuter = d3.select("svg#svgScree")
                    .attr("width", outerWidth)
                    .attr("height", outerHeight)

    plotInner = plotOuter
                    .append('g')
                    .attr('id', 'inner-plot')
                    .attr('width', innerWidth)
                    .attr('height', innerHeight)
                    .attr('transform', 'translate(' + margins.left + ',' + margins.top + ')')


    var xScale = d3.scaleBand().range ([0, innerWidth]).padding(0.4),
        yScale = d3.scaleLinear().range ([innerHeight, 0]);

    // var g = svg.append("g")
    //         .attr("transform", "translate(" + 100 + "," + 100 + ")");

    xScale.domain(pca_data.map(function(d) { return d.x; }));
    yScale.domain([0, 1]);

    plotInner.append("g")
        .attr("transform", "translate(0," + innerHeight + ")")
        .call(d3.axisBottom(xScale))
        .append("text")
        .attr("y", margins.bottom / 2)
        .attr("x", innerWidth / 2)
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .attr("fill", "black")
        .attr("font-size", "15px")
        .text("PCA Components");

    plotInner.append("g")
        .call(d3.axisLeft(yScale).tickFormat(function(d){
            return d*100 + '%';
        }).ticks(10))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", margins.left / 2 - 20)
        .attr("x", - innerHeight / 2 + 100)
        .attr("dy", "-5.1em")
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .attr("fill", "black")
        .attr("font-size", "12px")
        .text("Proportion of Variance Explained (%)");

    plotOuter.append("text")
        .attr("x", outerWidth/2 - margins.right)
        .attr("y", margins.top/2)
        .attr("font-size", "24px")
        .text("Scree Plot")

    const line = d3.line()
        .x(d => xScale(d.x)+xScale.bandwidth()/2)
        .y(d => yScale(d.cumsum))
        .curve(d3.curveCatmullRom.alpha(.5))

    plotInner.append('path')
            .datum(pca_data)
            .attr('class', 'curve')
            .attr('d', line)
            .attr('opacity', 0.6)

    // var points = plotInner.selectAll("circles")
    //         .data(pca_data)
    //         .enter()
    //         .append("circle")
    //         .attr("class", "point")
    //         .attr("cx", function(d) { return xScale(d.x) + xScale.bandwidth()/2; })
    //         .attr("cy", function(d) { return yScale(d.cumsum); })
    //         .attr("r", 4)
    //         .attr("fill", "blue")

    var my_group = plotInner.selectAll(".chart_group")
        .data(pca_data)
        .join(function(group){
            var enter = group.append("g").attr("class","chart_group");
            enter.append("rect").attr("class","group_rect");
            enter.append("text").attr("class","group_text");
            return enter;
        })

    my_group.exit().transition()
        .duration(1000).remove();

    var enter = my_group.enter()
                .append("g")
                .attr("class", "data_group");

    my_group.select(".group_rect")
                .on('mouseover', handleMouseOver)
                .on('mouseout', handleMouseOut)
                .on('click', handleMouseClick)
                .transition()
                .duration(1000)
                .attr("x", function(d) { return xScale(d.x); })
                .attr("y", function(d) { return yScale(d.y); })
                .attr("width", xScale.bandwidth())
                .attr("height", function(d) { return innerHeight - yScale(d.y); })
                .attr("fill", "blue")
                .attr("opacity", 0.6);

    my_group.select(".group_text")
                .attr("x", function(d) {
                    return xScale(d.x) + xScale.bandwidth()/2;
                })
                .attr("y", function(d) {
                        return yScale(d.y) - 10;
                })
                .style("visibility", "hidden")
                .attr("text-anchor","middle")
                .attr('fill', 'red')
                .text(function(d) { return String((d.cumsum * 100).toFixed(2)) + '%'; });


    // var bars = plotInner.selectAll("rect")
    //     .data(pca_data)
    //     .enter()
    //     .append("rect")
    //     .attr("class", "bar")
    //     .attr("x", function(d) { return xScale(d.x); })
    //     .attr("y", function(d) { return yScale(d.y); })
    //     .attr("width", xScale.bandwidth())
    //     .attr("height", function(d) { return innerHeight - yScale(d.y); })
    //     .attr("fill", "blue")
    //     .attr("opacity", 0.6);

    
    function handleMouseClick(d, i){
        var j;

        var curr = this.parentNode
        var prev = this.parentNode.previousSibling
        
        d_i = i+1;

        $.ajax({
            type: "POST",
            url: "/scree",
            contentType: "application/json",
            data: JSON.stringify(d_i),
            dataType: "json",
            success: function(response) {
                // console.log(response);
            },
            error: function(err) {
                console.log(err);
            }
        });
        
        $.ajax({
            type: "GET",
            url: "/top_features",
            success: function(response) {
                topfeat = JSON.parse(response);
                constructTable(topfeat, "table")

                $.ajax({
                    type: "GET",
                    url: "/scattermatrix",
                    success: function(response) {
                        // console.log(response);
                        smData = JSON.parse(response)
                        plotSMmatrix(smData)
                    },
                    error: function(err) {
                        console.log(err);
                    }
                });

                
            },
            error: function(err) {
                console.log(err);
            }
        });

        document.getElementById("d_i").innerHTML = "Intrinsic Dimensionality:   " + d_i;
        for(j=0; j<=i; j++){
            d3.select(curr.firstChild).attr("fill", "red")
            curr = prev
            prev = curr.previousSibling
        }
        curr=this.parentNode.nextSibling
        var next = this.parentNode.nextSibling.nextSibling
        for(j = i+1; j<data_len-1; j++){
            d3.select(curr.firstChild).attr("fill", "blue")
            curr = next
            next = curr.nextSibling
        }
    }
    
    function handleMouseOver(d, i){
        d3.select(this.nextSibling).style('visibility','visible');
        var j;

        var curr = this.parentNode
        var prev = this.parentNode.previousSibling

        for(j=0; j<=i; j++){
            d3.select(curr.firstChild).attr("opacity", 1);
            curr = prev
            prev = curr.previousSibling
        }
        curr=this.parentNode.nextSibling
        var next = this.parentNode.nextSibling.nextSibling
        for(j = i+1; j<data_len-1; j++){
            d3.select(curr.firstChild).attr("opacity", 0.6);
            curr = next
            next = curr.nextSibling
        }
    }

    function handleMouseOut(d, i){
        d3.select(this.nextSibling).style('visibility','hidden');
    }

    // bars.on("click", function(d, i){
    //     var j;

    //     var curr = this
    //     var prev = this.previousSibling
        
    //     d_i = i+1;

    //     $.ajax({
    //         type: "POST",
    //         url: "/scree",
    //         contentType: "application/json",
    //         data: JSON.stringify(d_i),
    //         dataType: "json",
    //         success: function(response) {
    //             // console.log(response);
    //         },
    //         error: function(err) {
    //             console.log(err);
    //         }
    //     });
        
    //     $.ajax({
    //         type: "GET",
    //         url: "/top_features",
    //         success: function(response) {
    //             topfeat = JSON.parse(response);
    //             constructTable(topfeat, "table")

    //             $.ajax({
    //                 type: "GET",
    //                 url: "/scattermatrix",
    //                 success: function(response) {
    //                     // console.log(response);
    //                     smData = JSON.parse(response)
    //                     plotSMmatrix(smData)
    //                 },
    //                 error: function(err) {
    //                     console.log(err);
    //                 }
    //             });

                
    //         },
    //         error: function(err) {
    //             console.log(err);
    //         }
    //     });

    //     document.getElementById("d_i").innerHTML = "Intrinsic Dimensionality:   " + d_i;
    //     for(j=0; j<=i; j++){
    //         d3.select(curr).attr("fill", "red")
    //         curr = prev
    //         prev = curr.previousSibling
    //     }
    //     curr=this.nextSibling
    //     var next = this.nextSibling.nextSibling
    //     for(j = i+1; j<data_len-1; j++){
    //         d3.select(curr).attr("fill", "blue")
    //         curr = next
    //         next = curr.nextSibling
    //     }
    // })

    // bars.on("mouseover", function(d, i){
    //     var j;

    //     var curr = this
    //     var prev = this.previousSibling
    
    //     for(j=0; j<=i; j++){
    //         d3.select(curr).attr("opacity", 1);
    //         curr = prev
    //         prev = curr.previousSibling
    //     }
    //     curr=this.nextSibling
    //     var next = this.nextSibling.nextSibling
    //     for(j = i+1; j<data_len-1; j++){
    //         d3.select(curr).attr("opacity", 0.6);
    //         curr = next
    //         next = curr.nextSibling
    //     }
    // })
}