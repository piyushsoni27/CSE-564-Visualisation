$.ajax({
        type: "GET",
        url: "/worldmap",
        success: function(response) {
            worldData = (response)
            worldMap(worldData, "total_cases")
        },
        error: function(err) {
            console.log(err);
        }
    });