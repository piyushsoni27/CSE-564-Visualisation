var marginWordCloud = {top: 30, right: 50, bottom: 30, left: 50};
var widthWordCloud = 960 - marginWordCloud.left - marginWordCloud.right;
var heightWordCloud = 500 - marginWordCloud.top - marginWordCloud.bottom;


function createWordCloud(data){
// d3.csv("static/js/Team_Info.csv",function(data){
// var color = d3.scaleOrdinal(d3.schemeCategory20);
  console.log(data)

  var g = d3.select("svg#svgWordCloud")
        .append("g")
        .attr("transform", "translate(" + marginWordCloud.left + "," + marginWordCloud.top + ")");

  const wordScale = d3.scaleLinear()
    	.domain([0,75])
    	.range([10,120])
    
var layout = d3.layout.cloud()
      .size([widthWordCloud, heightWordCloud])
      .timeInterval(20)
      .words(data)
      .rotate(function(d) { return 0; })
      .fontSize(d=>wordScale(d.count))
      //.fontStyle(function(d,i) { return fontSyle(Math.random()); })
      .fontWeight(["bold"])
      .text(function(d) { return d.hashtag; })
      .spiral("rectangular") // "archimedean" or "rectangular"
      .on("end", draw)
      .start();

   var wordcloud = g.append("g")
      .attr('class','wordcloud')
      .attr("transform", "translate(" + widthWordCloud/2 + "," + heightWordCloud/2 + ")");
      
   g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + heightWordCloud + ")")
      .selectAll('text')
//       .style('fill',function(d) { return color(d); })
//       .style('font','sans-serif');

function draw(words) {
    wordcloud.selectAll("text")
        .data(words)
        .enter().append("text")
        .attr('class','word')
//         .style("fill", function(d, i) { return color(i); })
        .style("font-size", function(d) { return d.size + "px"; })
//         .style("font-family", function(d) { return d.font; })

        .attr("text-anchor", "middle")
        .attr("transform", function(d) { return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")"; })
        .text(function(d) { return d.hashtag; });
};
  
// });

}