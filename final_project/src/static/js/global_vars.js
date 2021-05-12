var all_countries = []

var pcp_countries = ["United States of America", "India"]
var worldmap_country;

var selected_attr = "new_cases"
var selected_start_date = "2020-01-23"
var selected_end_date = "2021-04-17"

var worldmapvar

var worldmaptrigger =  {
    aInternal: null,
    aListener: function (val) { },
    set a(val) {
        this.aInternal = val;
        this.aListener(val);
    },
    get a() {
        return this.aInternal;
    },
    registerListener: function (listener) {
        this.aListener = listener;
    }
}

$.ajax({
    type: "GET",
    url: "/worldmap",
    success: function(response) {
        worldData = response
        for(var i in worldData.features)
            all_countries.push(worldData.features[i].properties.name);
        
        worldMap(worldData, selected_attr, all_countries)
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