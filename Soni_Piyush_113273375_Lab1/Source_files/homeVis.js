var data_global, variables_global; 

d3.csv(data_url)
  .then(d => {
    chartSetup(d)
    scatterSetup(d)
  })
  .catch(error => console.log(error))

function chartSetup(data) {
  data_global = data;
  // console.log(selectedMenu)
  variables_global = Object.keys(data[0])

  // populate selectors
  d3.select('select#chartsdropdown')
  .on('change', () => updateCharts())
  .selectAll('option')
  .data(variables_global)
  .enter()
  .append('option')
  .attr('value', d => d)
  .text(d => longVars[d])


  xvar = d3.select('select#chartsdropdown').property('value')
  
  if(cat_var.includes(xvar)){
    document.getElementById("hist").style.visibility = "hidden";
    document.getElementById("bar").style.visibility = "visible";
  }
  else{
    document.getElementById("hist").style.visibility = "visible";
    document.getElementById("bar").style.visibility = "hidden";
  }

  setupHist()
  setupBar()
}

function scatterSetup(data){
  // populate selectors
  d3.select('select#scatterdropdown')
  .on('change', () => updateScatterPlot())
  .selectAll('option')
  .data(variables_global)
  .enter()
  .append('option')
  .attr('value', d => d)
  .text(d => longVars[d])

  // console.log(scatterRadio)

  var selectedvar = d3.select('select#scatterdropdown').property('value')

  if(scatterRadio === 'x') xScattervar = selectedvar
  else yScattervar = selectedvar

  // xScattervar = d3.select('select#scatterdropdown').property('value')
  setupScatter();
}

function updateScatterPlot(){
  var selectedvar = d3.select('select#scatterdropdown').property('value')

  if(scatterRadio === 'x') xScattervar = selectedvar
  else yScattervar = selectedvar

  console.log(xScattervar)
  console.log(yScattervar)

  updateScatter();
}

function updateCharts(){
  xvar = d3.select('select#chartsdropdown').property('value')

  if(cat_var.includes(xvar)){
    // console.log("hvjdwedguwygd")
    document.getElementById("hist").style.visibility = "hidden";
    document.getElementById("bar").style.visibility = "visible";
  }
  else{
    document.getElementById("hist").style.visibility = "visible";
    document.getElementById("bar").style.visibility = "hidden";
  }
  

    if(cat_var.includes(xvar)) updateBar()
    else updateHist();
}

