// https://bl.ocks.org/alexb823/706a98eb9e729f0754f31cd6f4803155

var outerWidthWordCloud = 800, outerHeightWordCloud = 500/960 * outerWidthWordCloud

var marginWordCloud = {top: 30, right: 50, bottom: 30, left: 50};
var innerWidthWordCloud = outerWidthWordCloud - marginWordCloud.left - marginWordCloud.right;
var innerHeightWordCloud = outerHeightWordCloud - marginWordCloud.top - marginWordCloud.bottom;


function createWordCloud(data){

        var color = d3.scaleOrdinal(d3.schemeCategory10);

        document.getElementById("wordcloud").innerHTML = "";

        var plotOuter = d3.select("#wordcloud")
                        .append("svg")
                        .attr("width", outerWidthWordCloud)
                        .attr("height", outerHeightWordCloud)

        var plotInner = plotOuter.append("g")
                .attr("transform", "translate(" + marginWordCloud.left + "," + marginWordCloud.top + ")");

                const wordScale = d3.scaleLinear()
                .domain(d3.extent(data, function(d){ return +d['count']; }))
                .range([20,120])

        var layout = d3.layout.cloud()
                .size([innerWidthWordCloud, innerHeightWordCloud])
                .timeInterval(20)
                .words(data)
                .rotate(function() { return ~~(Math.random() * 2)*90; })
                .fontSize(d=>wordScale(d.count))
                .fontWeight(["bold"])
                .text(function(d) { return d.hashtag; })
                .spiral("rectangular") // "archimedean" or "rectangular"
                .on("end", draw)
                .start();

        function draw(words) {
                var wordcloud = plotInner.append("g")
                                .attr('class','wordcloud')
                                .attr("transform", "translate(" + innerWidthWordCloud/2 + "," + innerHeightWordCloud/2 + ")")
                                .selectAll("text")
                                .data(words)

                // wordcloud.exit().transition()
                // .duration(1000).remove();

                wordcloud.enter().append("text")
                        .attr('class','word')
                        .style("font-size", function(d) { return d.size  + "px"; })
                        .style("fill", function(d, i) { return color(i); })
                        .attr("text-anchor", "middle")
                        .text(function(d) { return d.hashtag; })
                        .transition()
                        .duration(600)
                        .style("font-size", function(d) { return d.size + "px"; })
                        .attr("transform", function(d) { return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")"; })
                        .style("fill-opacity", 1)
                
                wordcloud.exit()
                        .transition()
                        .duration(200)
                        .style('fill-opacity', 1e-6)
                        .attr('font-size', 1)
                        .remove();

        };


        }  

        // createWordCloud(data)

        // lineChartTrigger.registerListener(function(val) {
        //         dates = {}
        //         dates.start = selected_start_date
        //         dates.end = selected_end_date
                
                
        //     });