$('#covidattr').change('change', function() {
    covidattrvalue = document.getElementById('covidattr').value
    selected_attr = covidattrvalue
    // selected_countries = []
    // lineChartTrigger.a = covidattrvalue
    
    $.ajax({
        type: "POST",
        url: "/linechart",
        contentType: "application/json",
        data: JSON.stringify(worldmap_country),
        dataType: "json",
        success: function(response) {
            lineBubbleData = (response)
            linedata = lineBubbleData['lined']
            bubbledata = lineBubbleData['bubbled']
            createLineChart(linedata, bubbledata, selected_attr)
        },
        error: function(err) {
            console.log(err);
        }
    });
});

function resetDashboard(){
    console.log("reset")
    $("#covidattr").val("new_cases")
    $("#covidattr").change()
    pcp_countries = ["United States of America", "India"]
    worldmap_country = "world";

    selected_attr = "new_cases"
    selected_start_date = "2020-01-23"
    selected_end_date = "2021-04-17"
    selected_countries = []
    avg_cases = 0
    avg_deaths = 0
    avg_vaccinations = 0
    statData = ""

    currLine = "none"

    $.ajax({
        type: "GET",
        url: "/worldmap",
        success: function(response) {
            worldData = response

            createChoropleth(worldData, selected_attr)
        },
        error: function(err) {
            console.log(err);
        }
    });

    $.ajax({
        type: "GET",
        url: "/linechart",
        success: function(response) {
            lineBubbleData = JSON.parse(response)
            linedata = lineBubbleData['lined']
            bubbledata = lineBubbleData['bubbled']
            createLineChart(linedata, bubbledata, selected_attr)
        },
        error: function(err) {
            console.log(err);
        }
    });

    $.ajax({
        type: "GET",
        url: "/wordcloud",
        success: function(response) {
            wordCloudData = JSON.parse(response)
            createWordCloud(wordCloudData)
        },
        error: function(err) {
            console.log(err);
        }
    });

    $.ajax({
        type: "GET",
        url: "/pcp",
        success: function(response) {
            pcpData = JSON.parse(response)
            plot_pcp(pcpData)
        },
        error: function(err) {
            console.log(err);
        }
    });

    $.ajax({
        type: "GET",
        url: "/stats",
        success: function(response) {
            stats = JSON.parse(response)
            plotStats(stats)
        },
        error: function(err) {
            console.log(err);
        }
    });
}

$(document).ready( function() {

    $('#resetAll').click(resetDashboard);
    
});