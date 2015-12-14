/*-------------------GLOBAL VARIABLES--------------------------------------*/
var route; // used in line transitions
var routeTrans;
var totalLength; // used in line transitions
var reverseTotalLength; // used in line transitions
var vrhnikaData;
var transitionRoutes = false;

/*------------------used in SLIDER JS------------------*/
var dateArray = ["21 Oct 06:00 GMT+1", "21 Oct 11:00 GMT+1", 
"22 Oct 06:00 GMT+1", "22 Oct 12:00 GMT+1", "22 Oct 18:00 GMT+1",
"23 Oct 08:00 GMT+1", "23 Oct 12:00 GMT+1", "23 Oct 17:00 GMT+1",
"24 Oct 06:00 GMT+1", "24 Oct 12:00 GMT+1", "24 Oct 18:00 GMT+1",
"25 Oct 06:00 GMT+1", "25 Oct 12:00 GMT+1", "25 Oct 18:00 GMT+1",
"26 Oct 06:00 GMT+1", "26 Oct 12:00 GMT+1", "26 Oct 18:00 GMT+1",
"27 Oct 06:00 GMT+1", "27 Oct 12:00 GMT+1", "27 Oct 18:00 GMT+1",
"28 Oct 06:00 GMT+1", "28 Oct 12:00 GMT+1", "28 Oct 18:00 GMT+1",
"29 Oct 06:00 GMT+1",
"30 Oct 06:00 GMT+1","30 Oct 12:00 GMT+1", "30 Oct 18:00 GMT+1",
"31 Oct 06:00 GMT+1","31 Oct 12:00 GMT+1", "31 Oct 18:00 GMT+1",
"1 Nov 06:00 GMT+1", "1 Nov 12:00 GMT+1", "1 Nov 18:00 GMT+1",
"2 Nov 06:00 GMT+1", "2 Nov 12:00 GMT+1",
"3 Nov 06:00 GMT+1",
"4 Nov 06:00 GMT+1", "4 Nov 12:00 GMT+1", "4 Nov 18:00 GMT+1",
"5 Nov 06:00 GMT+1"];

//dataArray length
var dateArrayLength = dateArray.length;
//console.log("The length of the date array is: " + dateArrayLength);

//sliderValue - used in slider.js
var valueSlider = 0;
// used in slider.js: numRef = d.numRefugees[valueSlider];
var numRef;

//length of the NumRef array - used in valuesJSON()
var numRefArrayLength;
var numRefCount = 0;

//used in AUTOPLAY
var updateCount = 0;

/*-------------------WINDOW + RESIZE---------------------------------------*/
//check window width
var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight|| e.clientHeight|| g.clientHeight;

var updateWidthNew;
var updateHeightNew;
    //svgHeight = y * 0.92;
    //svgWidth = x * 0.97;
    //svgHeight = svgWidth/1.85;

    if(x < y){
	svgWidth = x* 0.96;
	svgHeight = svgWidth/2;
	}else if(y < x){
	svgHeight = y * 0.92;
	svgWidth = svgHeight*2;
	};

d3.select(window)
    .on("resize", sizeChange);


/*------------------------SVG OBJECT--------------------------------------*/
var svg = d3.select("#container").append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);


// SPLIT PATH INTO GROUPS
//GROUP1 - the map of SLOVENIA
var group1 = svg.append("g");
//GROUP 2 - the 
var group2 = svg.append("g");
//GROUP 3 - 
var group3 = svg.append("g");

var group4 = svg.append("g");

//PROJECTION
var projection = d3.geo.mercator()
	.scale(svgWidth*11)
	.translate([svgWidth/2, svgHeight/2])
	.center([14.45, 46.1]);
//PATH
var path = d3.geo.path()
	.projection(projection);
//SCALE
var rScale = d3.scale.linear()
    .range([5, 75]);

/*----------------MAP OF SLOVENIA GROUP 1 ----------------------------------*/
/*-----------------------called in document.ready---------------------------*/

function sloMap(){
	d3.json("trimmedDownEuropeGeo.json", function(error, json) {
	if (error) return console.error(error);

	group1.selectAll("path")
	.data(json.features)
	.enter()
	.append("path")
	.attr("d", path)
	.attr("stroke", function(d) {
        var value = d.properties.sovereignt;
        var coor = d.geometry.coordinates[0];
		if (value == "Hungary" || value == "Italy") {
        }
        else{
        	return "white"
        }
    })
	.attr("stroke-width", "2px")
	.attr("fill", function(d) {
        var value = d.properties.sovereignt;
		if (value == "Slovenia") {
        return "white";
        } else {                                //If value is undefined…
        	return "black";
        	}
    	})
		linesJSON();
	});
	
};

/*------------------------HIGHWAY - GROUP 2 -----------------------------------*/
/*-------------------------called in sloMap()----------------------------------*/
function linesJSON(){
	d3.json("MultipleCities.json", function(error, json){
	if (error) return console.error(error);

	//var grey = d3.rgb(255,100,100);
	console.log(json);

	//route is a global variable
    route = group2.selectAll("path")
    .data(json.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("stroke","grey")
    .attr("stroke-width","0.5px")
    .style("fill","none");

    routeTrans =
    group4.selectAll("path")
    .data(json.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("stroke","red")
    .attr("stroke-width","3px")
    .style("fill","none");
    //both totalLength and reverseTotalLength are local variables
    totalLength = route.node().getTotalLength();
    reverseTotalLength = -totalLength;

    //stroke-dasharray - crucial for the transition
    routeTrans
    .attr("stroke-dasharray", totalLength + " " + totalLength)
    .attr("stroke-dashoffset", totalLength)

    transitionRoutes = true;
    valuesJSON();
	});
};

/*-----------------------LINE TRANSITION----------------------------------*/
function updateTransition(centerName){
	console.log("yes,I've been called");
	//go through it once again to make sure you understand i;
	if(transitionRoutes){
	routeTrans
	.attr("stroke-dasharray", totalLength + " " + totalLength)
	.attr("stroke-dashoffset", totalLength);

	routeTrans
	.transition()
	.duration(800)
	.ease("linear")
	.attr("stroke-dashoffset", 0)
	.transition()
	.delay(300)
	.duration(800)
	.ease("linerar")
	.attr("stroke-dashoffset",reverseTotalLength)
	};
};

/*------------------------------REFUGEES DATA---------------------------*/
/*-----------------------------called in sloMap()-----------------------*/
function valuesJSON(){
d3.json("updatedValuesGeocode.json", function(data) {
	console.log("we'll start plotting the circles");

//check the numRefugees array length - numRefArrayLength is a global variable
	numRefArrayLength = d3.keys(data[0].numRefugees).length;
	console.log("numRefugees array length is: " + numRefArrayLength);

//specify the scale numRefCount = 0;
	rScale.domain([
	d3.min(data, function(d){ return d.numRefugees[numRefCount]}),
	d3.max(data, function(d){ return d.numRefugees[numRefCount]})
	]);

//plot the circles
	group1.selectAll("circle")
	.data(data)
	.enter()
	.append("circle")
	.attr("cx", function(d) {
		return projection([d.longitude, d.latitude])[0];
	})
	.attr("cy", function(d) {
		return projection([d.longitude, d.latitude])[1];
	})
//radius attributes;
	.attr("r", function(d) {
		//num ref is a global variable
		numRef = d.numRefugees[numRefCount];
		if(numRef){
			return rScale(numRef)
		}
			else{
				return 0
			}
		})
//fill depends on the type of immigration center (i.e. accommodation vs reception)
	.style("fill", function(d){
		if(d.typeOfCenter == "reception"){
			return "grey"
		}
		else{
			return "red"
			}
		})
	.style("opacity", 0.75)
//ONCLICK
	.on('click',function(d) {
		console.log("yes, we've registered a successful click");
		numRefInfo(d)})
//onMouseover
	.on("mouseover", function(d){
		d3.select(this)
		.attr("stroke", "purple")
		.attr("stroke-width","4")
		.classed("pointerActive", true);
//tooltip
		d3.select("#tooltip")
  		.style("left", (d3.event.pageX + 30)+ "px")
 	    .style("top", (d3.event.pageY - 30)+ "px")
  		.html("<strong>" + d.name + "</strong>" + " " + d.typeOfCenter + " center" + "<br/>" + "<strong>" + d.numRefugees[valueSlider] + "</strong>" + " people")
		.classed("hidden", false);
		})
//onMouseout
	.on("mouseout", function(){
		d3.select(this)
		.attr("stroke", " ")
		.attr("stroke-width"," ")
		.classed("pointerActive", false);
//hide the tooltip
		d3.select("#tooltip").classed("hidden", true);
		})
	console.log("we'll done with plotting circles");
	});
	console.log("this is the end of the valuesJSON function");
};

/*---------------------------------SIZE CHANGE FUNCTION--------------------------*/
function sizeChange(){
	console.log("the size is changing ");

	updateWidth = w.innerWidth || e.clientWidth || g.clientWidth;
    updateHeight = w.innerHeight|| e.clientHeight|| g.clientHeight;

    console.log(updateWidth + " " + updateHeight);

    
    if(updateWidth < updateHeight){
	updateWidthNew = updateWidth* 0.96;
	updateHeightNew = updateWidthNew;
	}else if(updateHeight < updateWidth){
	updateHeightNew = updateWidth* 0.92;
	updateWidthNew = updateHeightNew;
	};

    //updateWidth = x * 0.97;
    //updateHeight = y/1.85;
    //UPDATE THE SIZE OF THE SVG
    d3.select("svg")
    .attr("width", updateWidthNew)
    .attr("height", updateHeightNew);
    //rescale the map
	d3.select("g").attr("transform", "scale(" + updateWidthNew/svgWidth + ")");
	route.attr("transform", "scale(" + updateWidthNew/svgWidth + ")");
	routeTrans.attr("transform", "scale(" + updateWidthNew/svgWidth + ")");
}


function numRefInfo(dataObj){
	console.log(dataObj.numRefugees);
	console.log("There are currently " + dataObj.numRefugees[valueSlider] + " refugees in this center");		
	$("#textbox").html(' ');
	d3.select("#textbox")
	.append("p")
	.text(dataObj.numRefugees[valueSlider])
}



function updateData(){	
    //display the dates depending on the value of the slider
    $("#dateDisplay").html(dateArray[updateCount]);           	
    // update the radius range
    d3.json("updatedValuesGeocode.json", function(error, data) {
      rScale.domain([
		    d3.min(data, function(d){ return d.numRefugees[updateCount]}),
				d3.max(data, function(d){ return d.numRefugees[updateCount]})
				]);

    // vrhnika transition
    vrhnikaData = data[4].numRefugees[updateCount];
    //console.log(vrhnikaData);
    if(vrhnikaData!==0){
    	updateTransition();
    };
    // Make the changes to the svg
      svg.selectAll("circle")
        .data(data)
        .transition()
        .duration(500)
        .ease("in-out")
        //update radii
        .attr("r", function(d) {
			numRef = d.numRefugees[updateCount];
			if(numRef){
				return rScale(numRef)
			}
          	else{
				return 0
			}
		});
	});
 }

updateData();

/*-------------------AUTOPLAY-------------------*/
/*----------------------------------------------*/

  var playing = false,
      loop    = null;
       
      d3.select("#autoplay").on("click", function() {
      	var theDate = $("#slider").slider('value');

      	updateCount = theDate;

        d3.event.preventDefault();
        if (playing) {
          playing = false;
          clearInterval(loop);
          return d3.select(d3.event.target).text("Autoplay");
        } else {
          playing = true;
          loop    = setInterval(function() { 
          		updateCount += 1;

          		if(updateCount < dateArrayLength - 1){
          		console.log(valueSlider);
          		setValue(updateCount);
          		updateData();
          		}
          		else if (updateCount = dateArrayLength -1){
          		updateCount = 0;
          		}
          },1200 );
          return d3.select(d3.event.target).text("Stop Autoplay");
          }
        
      });

// For the Set clickable values, we use variable theValue to supply value.
function setValue(theValue) {

    // Animate the Button to the value clicked on.
    $("#slider").slider('value', theValue);

    //Display the numeric value on the html page.
    $('#showValue').html('Value: ' + theValue);
};

function callServer(){
	$.ajax({
		url: '/api/buttonPress',
		type: 'GET',
		//dataType: 'json',
		error: function(data){
			console.log("We got problems.");
		},
		success: function(data){
			console.log("YEESSSS");
			}
		});
};

/*--------------------DOCUMENT READY-----------------*/

$(document).ready(function(){
	console.log("I'm ready show me what you got!");
	//newLineJSON();
	sloMap();
	$('#autoplay').click(function(){
		console.log("clicked");
	});

	$('#callToAction').click(function(){
		console.log("clicked call to action");
		callServer();
	});

	/*$('#transition').click(function(){
		console.log("transition");
		updateTransition();
	});*/
})


