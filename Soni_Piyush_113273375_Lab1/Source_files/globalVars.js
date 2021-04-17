// // how long transitions last (msec)
let transitionTime = 1000

//data_url
data_url = "data/boston_data.csv"

// explanations of the variables that make good plot labels.
let longVars = {
  CRIM: 'per capita crime rate by town',
  ZN: 'proportion of residential land zoned for lots over 25,000 sq.ft.',
  INDUS: 'proportion of non-retail business acres per town',
  CHAS: 'Charles River dummy variable (= 1 if tract bounds river; 0 otherwise)',
  NOX: 'nitric oxides concentration (parts per 10 million)',
  RM: 'average number of rooms per dwelling',
  AGE: 'proportion of owner-occupied units built prior to 1940',
  DIS: 'weighted distances to five Boston employment centres',
  RAD: 'index of accessibility to radial highways',
  TAX: 'full-value property-tax rate per $10,000',
  PTRATIO: 'pupil-teacher ratio by town',
  B: '1000(Bk - 0.63)^2 where Bk is the proportion of blacks by town',
  LSTAT: '% lower status of the population',
  MEDV: 'Median value of owner-occupied homes in $1000\'s'
}

var cat_var = ["CHAS", "RAD"];

// use Margin Convention to layout the SVG with an inner plotting region
// and an outer region for axes, labels, etc.
let outerWidth = 750
let outerHeight = (2/3) * outerWidth
let margins = { top: 30, bottom: 60, left: 60, right: 10 }
let innerWidth = outerWidth - margins.left - margins.right - 10
let innerHeight = outerHeight - margins.top - margins.bottom - 10

let xAxis, yAxis, xScale, yScale;
let xCatScale, yCatScale, xCatAxis, yCatAxis;
let xScatterScale, yScatterScale, xScatterAxis, yScatterAxis;
let isCat = 0;

var xvar="CRIM", yvar="ZN", dropdown, selectedMenu, xScattervar="CRIM", yScattervar="ZN", scatterRadio='x';

var isChartSelected, isScatterSelected;

let plotOuterGlobal = d3
    .select('svg#global')
    .attr('width', outerWidth)
    .attr('height', outerHeight)
  
let plotInnerGlobal = plotOuterGlobal
    .append('g')
    .attr('id', 'inner-plot')
    .attr('width', innerWidth)
    .attr('height', innerHeight)
    .attr('transform', 'translate(' + margins.left + ',' + margins.right + ')')

let plotOuterHist = d3
    .select('svg#hist')
    .attr('width', outerWidth)
    .attr('height', outerHeight)
  
let plotInnerHist = plotOuterHist
    .append('g')
    .attr('id', 'inner-plot')
    .attr('width', innerWidth)
    .attr('height', innerHeight)
    .attr('transform', 'translate(' + margins.left + ',' + margins.top + ')')

let plotOuterBar = d3
    .select('svg#bar')
    .attr('width', outerWidth)
    .attr('height', outerHeight)
  
let plotInnerBar = plotOuterBar
    .append('g')
    .attr('id', 'inner-plot')
    .attr('width', innerWidth)
    .attr('height', innerHeight)
    .attr('transform', 'translate(' + margins.left + ',' + margins.right + ')')

let plotOuterScatter = d3
    .select('svg#scatter')
    .attr('width', outerWidth)
    .attr('height', outerHeight)
  
let plotInnerScatter = plotOuterScatter
    .append('g')
    .attr('id', 'inner-plot')
    .attr('width', innerWidth)
    .attr('height', innerHeight)
    .attr('transform', 'translate(' + margins.left + ',' + margins.right + ')')