function update() {
    // console.log("update called!!")
    dates = {}
    dates.start = selected_start_date
    dates.end = selected_end_date

    // console.log(dates)

    $.ajax({
        type: "POST",
        url: "/worldmap",
        contentType: "application/json",
        data: JSON.stringify(dates),
        dataType: "json",
        success: function(response) {
            worldData = (response)
            worldMap(worldData, selected_attr, all_countries)
        },
        error: function(err) {
            console.log(err);
        }
    });

    $.ajax({
        type: "POST",
        url: "/wordcloud",
        contentType: "application/json",
        data: JSON.stringify(dates),
        dataType: "json",
        success: function(response) {
            wordCloudData = (response)
            createWordCloud(wordCloudData)
        },
        error: function(err) {
            console.log(err);
        }
    });
}