$.ajax({
        type: "POST",
        url: "/worldmap",
        contentType: "application/json",
        data: JSON.stringify(val),
        dataType: "json",
        success: function(response) {
            mds_eucData = (response)
            plot_mds_euc(mds_eucData)
        },
        error: function(err) {
            console.log(err);
        }
    });