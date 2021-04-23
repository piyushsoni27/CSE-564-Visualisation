// https://www.d3-graph-gallery.com/graph/barplot_stacked_basicWide.html

// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 80},
    width = 500 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

function createBarChart(data, attr) {
    // console.log(d3.keys(data[0]))

    columns = d3.keys(data[0]).slice(2)
    console.log(columns)

    var subgroups = columns.filter(
        function( s ) { return s.indexOf( 'new_cases' ) !== -1; }
    );

    // console.log(matches)

    // append the svg object to the body of the page
    var svg = d3.select("svg#svgBarChart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // // Parse the Data
    // d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_stacked.csv", function(data) {

    // // List of subgroups = header of the csv files = soil condition here
    // // var subgroups = data.columns.slice(1)
    // var subgroups = d3.keys(data[0]).slice(1)
    console.log(subgroups)
    // List of groups = species here = value of the first column called group -> I show them on the X axis
    var groups = d3.map(data, function(d){return(d.season)}).keys()
    console.log(groups)
    // Add X axis
    var x = d3.scaleBand()
        .domain(groups)
        .range([0, width])
        .padding([0.2])
        
    
    svg.append("g") 
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSizeOuter(0))
        .append("text")
        .attr("y", margin.bottom-2)
        .attr("x", width / 2 + 10)
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .attr("fill", "black")
        .attr("font-size", "15px")
        .text("Seasons");
    
    var max_north = d3.max(data, function(d){ return +d["new_cases_north"] }) 
    var max_south = d3.max(data, function(d){ return +d["new_cases_south"] }) 

    // console.log(max)
    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, max_north+max_south])
        .range([ height, 0 ]);
    svg.append("g")
        .call(d3.axisLeft(y).tickFormat(function(d){
            return d/1000000 + 'M';
        }))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("x", - height/2 + 50)
        .attr("dy", "-5.1em")
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .attr("fill", "black")
        .attr("font-size", "12px")
        .text("Count of total cases");
        

    // color palette = one color per subgroup
    var color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(['#e41a1c','#377eb8','#4daf4a'])

    //stack the data? --> stack per subgroup
    var stackedData = d3.stack()
        .keys(subgroups)
        (data)

    // Show the bars
    svg.append("g")
        .selectAll("g")
        // Enter in the stack data = loop key per key = group per group
        .data(stackedData)
        .enter().append("g")
        .attr("fill", function(d) { return color(d.key); })
        .selectAll("rect")
        // enter a second time = loop subgroup per subgroup to add all rectangles
        .data(function(d) { return d; })
        .enter().append("rect")
            .attr("x", function(d) { return x(d.data.season); })
            .attr("y", function(d) { return y(d[1]); })
            .attr("height", function(d) { return y(d[0]) - y(d[1]); })
            .attr("width",x.bandwidth())
    // })
}