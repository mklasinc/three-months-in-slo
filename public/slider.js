//this function is used down there, in the slider
//var = valueSlider is defined in scripts1.js
function getSliderValue(){
    valueSlider = $("#slider").slider("option","value");
};


//create a slider
$("#slider").slider({
  //animate fast//slow
  animate: "slow",
  //initial value, min, max, step
  value:0,
  min: 0,
  max: 39,
  step: 1,
  //slide function, called every time a change occurs
  slide: function( event, ui ) {
    //get sliderValue - set var valueSlider to the current value
    getSliderValue();

    //display the dates depending on valueSlider
    $("#dateDisplay").html(dateArray[valueSlider]);
               	
    // update radius range
    d3.json("data/updatedValuesGeocode.json", function(error, data) {
      rScale.domain([
		    d3.min(data, function(d){ return d.numRefugees[valueSlider]}),
				d3.max(data, function(d){ return d.numRefugees[valueSlider]})
				]);

    var vrhnikaDataSlider = data[0].numRefugees[valueSlider];
    console.log(vrhnikaDataSlider);
    /*if(vrhnikaDataSlider!==0){
      route
      .attr("stroke-dashoffset", totalLength);

      route
      .transition()
      .duration(500)
      .ease("linear")
      .attr("stroke-dashoffset", 0)
      .transition()
      .delay(200)
      .duration(500)
      .ease("linerar")
      .attr("stroke-dashoffset",reverseTotalLength)
    };*/
    // change circle radii
      svg.selectAll("circle")
        .data(data)
        .transition()
        .duration(300)
        .ease("in-out")
        /*--------------UPDATE RADII-----------------------------*/
        .attr("r", function(d) {
        //var numRef is defined in scripts1.js
        //numRef - date index
				  numRef = d.numRefugees[valueSlider];
				  if(numRef){
					 return rScale(numRef)
				  }
          else{
						return 0
					}
				});
		});
  }
});

// display the first date, it doesn't work if you don't do it
function displayDates(){
    $("#dateDisplay").html(dateArray[0])
};

displayDates();