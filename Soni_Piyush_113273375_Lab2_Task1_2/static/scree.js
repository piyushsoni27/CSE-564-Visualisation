fetch('/scree')
      .then(function (response) {
          return response.json();
      }).then(function (pca_data) {
          screePlot(pca_data)
      });

fetch('/biplot')
      .then(function (response) {
          return response.json();
      }).then(function (biplot_data) {
        fetch('/biplotaxis')
        .then(function (response) {
            return response.json();
        }).then(function (axis_data) {
            biPlot(biplot_data, axis_data)
        });
        //   biPlot(biplot_data)
      });



$.ajax({
type: "GET",
url: "/top_features",
success: function(response) {
    topfeat = JSON.parse(response);
    constructTable(topfeat, "table")

    $.ajax({
        type: "GET",
        url: "/scattermatrix",
        success: function(response) {
            // console.log(response);
            smData = JSON.parse(response)
            plotSMmatrix(smData)
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

var slideData = [1, 2,3,4,5,6,7,8,9,10]

// Step
var sliderStep = d3
.sliderBottom()
.min(2)
.max(6)
.width(300)
// .tickFormat(d3.format('.2%'))
.ticks(5)
.step(1)
.default(2)
.on('onchange', val => {
    $.ajax({
        type: "POST",
        url: "/scattermatrix",
        contentType: "application/json",
        data: JSON.stringify(val),
        dataType: "json",
        success: function(response) {
            console.log(response)
            smData = (response)
            plotSMmatrix(smData)
        },
        error: function(err) {
            console.log(err);
        }
    });
});

var gStep = d3
.select('div#slider-step')
.append('svg')
.attr('width', 500)
.attr('height', 80)
.append('g')
.attr('transform', 'translate(30,30)');

gStep.call(sliderStep);

d3.select('p#value-step').text((sliderStep.value()));