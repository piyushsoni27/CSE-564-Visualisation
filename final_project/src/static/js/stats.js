var outerWidthStats = 300,
    outerHeightStats = 350

var marginStats = { top: 10, right: 10, bottom: 10, left: 10 };
var innerWidthStats = outerWidthStats - marginStats.left - marginStats.right;
var innerHeightStats = outerHeightStats - marginStats.top - marginStats.bottom;

var dataglobal

function plotStats(data) {
    dataglobal = data
    d3.select("#svgcovidstats svg").remove();
    var plotOuter = d3.select("#svgcovidstats").append("svg")
        .attr("width", outerWidthStats)
        .attr("height", outerHeightStats)

    plotOuter.append("text").attr("x", 140).attr("y", 30).text(locationIDMap[worldmap_country]).attr("fill", "#ff8d62").attr("stroke", "#ccc").attr("text-anchor", "middle")
        .style("font-size", "25px");
    plotOuter.append("text").attr("x", 140).attr("y", 55).text(selected_start_date + " TO " + selected_end_date).attr("fill", "#ff8d62").attr("stroke", "#ccc").attr("text-anchor", "middle")
        .style("font-size", "18px");

    plotOuter.append("text").attr("x", 140).attr("y", 95).text("Average Daily Cases").attr("fill", "#ccc").attr("stroke", "#ccc").attr("text-anchor", "middle")
        .style("font-size", "20px");
    cases_avg = Math.floor(d3.mean(data, function(d) { return +d['new_cases']; }))
    plotOuter.append("text").attr("class", "text " + "new_cases").attr("x", 140).attr("y", 140).text(cases_avg).attr("text-anchor", "middle")
        .style("font-size", "40px").style("fill", "#FF884D");

    plotOuter.append("text").attr("x", 140).attr("y", 170).text("Average Daily Deaths").attr("fill", "#ccc").attr("stroke", "#ccc").attr("text-anchor", "middle")
        .style("font-size", "20px");
    deaths_avg = Math.floor(d3.mean(data, function(d) { return +d['new_deaths']; }))
    plotOuter.append("text").attr("class", "text " + "new_deaths").attr("x", 140).attr("y", 215).text(deaths_avg).attr("text-anchor", "middle")
        .style("font-size", "40px").style("fill", "#FF884D");

    plotOuter.append("text").attr("x", 140).attr("y", 245).text("Average Daily Vaccinations").attr("fill", "#ccc").attr("stroke", "#ccc").attr("text-anchor", "middle")
        .style("font-size", "20px");
    vaccinations_avg = Math.floor(d3.mean(data, function(d) { return +d['new_vaccinations']; }))
    plotOuter.append("text").attr("class", "text " + "new_vaccinations").attr("x", 140).attr("y", 290).text(vaccinations_avg).attr("text-anchor", "middle")
        .style("font-size", "40px").style("fill", "#FF884D");

    function updateStats(cases_avg, deaths_avg, vaccinations_avg) {
        d3.select(".new_cases").attr("class", "text " + "new_cases").attr("x", 80).attr("y", 40).transition().duration(1000).text(cases_avg).attr("text-anchor", "middle")
            .style("font-size", "25px").style("fill", "#FF884D");
        d3.select(".new_deaths").attr("class", "text " + "new_deaths").attr("x", 80).attr("y", 40).transition().duration(1000).text(deaths_avg).attr("text-anchor", "middle")
            .style("font-size", "25px").style("fill", "#FF884D");
        d3.select(".new_vaccinations").attr("class", "text " + "new_vaccinations").attr("x", 80).attr("y", 40).transition().duration(1000).text(vaccinations_avg).attr("text-anchor", "middle")
            .style("font-size", "25px").style("fill", "#FF884D");
    }

    statsTrigger.registerListener(function(val) {
        // console.log(val)
        $(document).ready(function() {
            $.ajax({
                type: "POST",
                url: "/stats",
                contentType: "application/json",
                data: JSON.stringify(val),
                dataType: "json",
                success: function(response) {
                    data = (response)
                        // avg_cases = Math.floor(d3.mean(data, function(d) { return +d['new_cases']; }))
                        // avg_deaths = Math.floor(d3.mean(data, function(d) { return +d['new_deaths']; }))
                        // avg_vaccinations = Math.floor(d3.mean(data, function(d) { return +d['new_vaccinations']; }))
                        // console.log(data)
                    plotStats(data)
                },
                error: function(err) {
                    console.log(err);
                }
            });
        });
    });

    statsTrigger2.registerListener(function(val) {
        // console.log(statData)
        data = statData
            // avg_cases = Math.floor(d3.mean(data, function(d) { return +d['new_cases']; }))
            // avg_deaths = Math.floor(d3.mean(data, function(d) { return +d['new_deaths']; }))
            // avg_vaccinations = Math.floor(d3.mean(data, function(d) { return +d['new_vaccinations']; }))
        plotStats(data)
    });
}