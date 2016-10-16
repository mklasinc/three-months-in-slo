//UPDATE DATA()

    for(var i = 0; i < 10; i++){
    	vrhnikaDate = data[i].numRefugees[updateCount];
    	//console.log();
    //console.log(vrhnikaData);
   		if(vrhnikaData!==0){
    	updateTransition(data[i].name);
    	}
    };


    // vrhnika transition
    vrhnikaData = data[4].numRefugees[updateCount];
    //console.log(vrhnikaData);
    if(vrhnikaData!==0){

    };


    routeTrans
    	.data(data)
		.attr("stroke-dasharray", totalLength + " " + totalLength)
		.attr("stroke-dashoffset",totalLength)
		.attr("stroke", function(d){
			if(d.numRefugees[updateCount] !== 0){
			return "red"
			};
		})
    	.attr("stroke-width","3px")
		.transition()
		.duration(800)
		.ease("linear")
		.attr("stroke-dashoffset", 0)
		.transition()
		.delay(1000)
		.duration(400)
		.ease("linear")
		.attr("stroke-dashoffset",reverseTotalLength);


	.attr("stroke-dashoffset", function(d){
			if(d.numRefugees[updateCount] !== 0){
				//console.log(d.name);
				return totalLength;
			};
		});

	

	