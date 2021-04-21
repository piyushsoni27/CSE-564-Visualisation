$.ajax({
    type: "GET",
    url: "/worldmap",
    success: function(response) {
        worldData = JSON.parse(response)
        worldMap(geoData, worldData, "new_cases")
    },
    error: function(err) {
        console.log(err);
    }
});

$.ajax({
    type: "GET",
    url: "/linechart",
    success: function(response) {
        lineData = JSON.parse(response)
        createLineChart(lineData)
    },
    error: function(err) {
        console.log(err);
    }
});