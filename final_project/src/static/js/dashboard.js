$.ajax({
    type: "GET",
    url: "/worldmap",
    success: function(response) {
        worldData = JSON.parse(response)
        worldMap(geoDataGlobal, worldData, "new_cases")
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
        createLineChart(linedata, bubbledata)
    },
    error: function(err) {
        console.log(err);
    }
});

$.ajax({
    type: "GET",
    url: "/barchart",
    success: function(response) {
        barData = JSON.parse(response)
        createBarChart(barData)
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