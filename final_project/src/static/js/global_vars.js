var geoDataGlobal;

$.ajax({
    type: "GET",
    url: "/geo_data",
    success: function(response) {
        geoDataGlobal = (response)
        console.log(geoDataGlobal)
    },
    error: function(err) {
        console.log(err);
    }
});