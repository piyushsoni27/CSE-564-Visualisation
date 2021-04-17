$.ajax({
    type: "GET",
    url: "/mds_euc",
    success: function(response) {
        mds_euc = JSON.parse(response);
        plot_mds_euc(mds_euc)
    },
    error: function(err) {
        console.log(err);
    }
});

$.ajax({
    type: "GET",
    url: "/mds_corr",
    success: function(response) {
        mds_corr = JSON.parse(response);
        plot_mds_corr(mds_corr)
    },
    error: function(err) {
        console.log(err);
    }
});

$.ajax({
    type: "GET",
    url: "/pcp",
    success: function(response) {
        pcp_data = JSON.parse(response);
        var order = ["Distance", "ActualElapsedTime", "CRSElapsedTime", "CRSDepTime", "DepTime", "CRSArrTime", "ArrTime", "DepDelay", "ArrDelay", "FlightNum"]
        plot_pcp(pcp_data, order)
    },
    error: function(err) {
        console.log(err);
    }
});

// Step
var sliderStepMDSeuc = d3
.sliderRight()
.min(2)
.max(6)
.width(500)
// .tickFormat(d3.format('.2%'))
.ticks(5)
.step(1)
.default(2)
.on('onchange', val => {
    $.ajax({
        type: "POST",
        url: "/mds_euc",
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
});

var gStepMDSeuc = d3
.select('div#slider-step-MDSeuc')
.append('svg')
.attr('width', 200)
.attr('height', 500)
.append('g')
.attr('transform', 'translate(30,30)');

gStepMDSeuc.call(sliderStepMDSeuc);

d3.select('p#value-step-MDSeuc').text((sliderStepMDSeuc.value()));