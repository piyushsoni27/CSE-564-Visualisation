$('#covidattr').change('change', function() {
    covidattrvalue = document.getElementById('covidattr').value
    selected_attr = covidattrvalue
    
    // lineChartTrigger.a = covidattrvalue
    
    $.ajax({
        type: "POST",
        url: "/linechart",
        contentType: "application/json",
        data: JSON.stringify(worldmap_country),
        dataType: "json",
        success: function(response) {
            lineBubbleData = (response)
            linedata = lineBubbleData['lined']
            bubbledata = lineBubbleData['bubbled']
            createLineChart(linedata, bubbledata, selected_attr)
        },
        error: function(err) {
            console.log(err);
        }
    });
});