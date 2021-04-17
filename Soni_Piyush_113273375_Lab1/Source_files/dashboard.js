// To retain the state of button..if clicked somewhere else on screen
$(document).ready(function () {
  $('button').on('click', function() {
    $('button').removeClass('active');
    $(this).addClass('active');

    selectedMenu = $(this).val();
    // console.log(selectedMenu);

    if(selectedMenu === "data"){
      $("#datadiv").show();
      $("#chartsdiv").hide();
      $("#scatterdiv").hide();
    }
    else if(selectedMenu === "charts"){
      $("#datadiv").hide();
      $("#chartsdiv").show();
      $("#scatterdiv").hide();
    } 
    else if(selectedMenu === "scatter"){
      $("#datadiv").hide();
      $("#chartsdiv").hide();
      $("#scatterdiv").show();
    }

  });
});

//to get the selected radio button value
if (document.querySelector('input[name="scatterVariable"]')) {
    document.querySelectorAll('input[name="scatterVariable"]').forEach((elem) => {
      elem.addEventListener("change", function(event) {
        scatterRadio = event.target.value;
        console.log(scatterRadio);
      });
    });
  }
