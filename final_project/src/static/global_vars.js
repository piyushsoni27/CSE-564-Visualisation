var geoData;

$.ajax({
    type: "GET",
    url: "/geo_data",
    success: function(response) {
        geoData = (response)
    },
    error: function(err) {
        console.log(err);
    }
});