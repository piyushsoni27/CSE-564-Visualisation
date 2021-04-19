$.ajax({
        type: "GET",
        url: "/worldmap",
        success: function(response) {
            worldData = JSON.parse(response)
            
            $.ajax({
                type: "GET",
                url: "/geo_data",
                success: function(response) {
                    geoData = (response)
                    
                    worldMap(geoData, worldData)
                },
                error: function(err) {
                    console.log(err);
                }
            });
        },
        error: function(err) {
            console.log(err);
        }
    });