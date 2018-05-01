$("document").ready(function(){

    var map = initMap();
    //var domain = "http://localhost:8080/";
    var domain = "https://seelsapp.herokuapp.com/";
    var lat ,lng;
    var roadLine , roadID=-1;

    // initialize <select>
    function showDrivers()
	{
		$.get(domain+'getAllDrivers/').then(function(response)
		{
			var arr = response ;
			var drivers = "" ;
            
            for (var i=0 ; i< arr.length ; i++)
			{
				drivers += "<option value='"+arr[i].driver_id+"'>"+arr[i].driver_id +"," + arr[i].name + "</option>" ; 
			}
			
			$("#driver").html(drivers);
		});	
	}
	
	function showTrucks()
	{
		$.get(domain+'getAllTrucks/').then(function(response)
		{
            var arr = response ;
            var trucks = "";
			for (var i=0 ; i< arr.length ; i++)
			{
                trucks+= "<option>" + arr[i].id+ "</option>";
            }
            $("#truck").html(trucks);
		});			
    }
    
    function showGoods()
	{
		$.get(domain+'getAllGoods/').then(function(response)
		{
            var arr = response ;
            var goods = "";
			for (var i=0 ; i< arr.length ; i++)
			{
                goods+= "<option>" + arr[i].name+ "</option>";
            }
            $("#goodName").html(goods);
		});			
    }

    // get src , dest from map

    google.maps.event.addListener(map,'click',function (event) {                
        lat = event.latLng.lat();
        lng =  event.latLng.lng();     
    });

    $("#exRoadsBtn").click(function(){
        $("#newRoadDetails").hide();
        $("#existingRoadDetails").show();
    });
    
    $("#newRoadsBtn").click(function(){
        $("#existingRoadDetails").hide();
        $("#newRoadDetails").show();
    });

    $("#mapSrc").click(function(){
       $("#sourceLng").val(lng);
       $("#sourceLat").val(lat);
    });
    
    $("#mapDest").click(function(){
        $("#destinationLng").val(lng);
        $("#destinationLat").val(lat);
     });

     // get existing roads , add them to <select>
     $("#exRoadsBtn").click(function(){
        $.get(domain+"getAllRoads").then(function(response){
            var roads = "" ;
            for (var i=0 ; i<response.length ; i++)
            {
                roads+="<option value=" +  response[i].road.id + ">" + response[i].road.name + "</option>";
            }
            $("#exRoads").html(roads);
        });
    });

    // Highlights the selected road on the map (existing)
    $("#showRoad").click(function(){
        $.get(domain+"getRoad/" + $( "#exRoads option:selected" ).val()).then(function(response)
		{
            var road = response.Success;
            console.log($( "#exRoads option:selected" ).val());
            //roadLine.setMap(null);      // Remove the old road
            roadLine = highlightRoad(road);
		});
    });

    // update road id on change of "select" value
    $('#exRoads').on('change', function() {
        roadID = this.value;
      })

    // Add trip -> save road if new then save the trip
    $("#submit").click(function(){

        console.log(domain+"saveTrip/" + $( "#truck option:selected" ).text()+"/" + $( "#driver option:selected" ).val()
               +"/0/" + roadID+"/"+ $("input[type='date']").val());

        if (roadID == -1)
        {
            // SAVE NEW ROAD
            $.get(domain+"saveRoad/"+$("#roadName").val()+"/"+$("#destinationLat").val()+"/"+$("#destinationLng").val()+"/"
            +$("#sourceLat").val()+"/"+$("#sourceLng").val()+"/1/").then(function(response){
                if (response.Success)
                {
                    roadID = response.Success;
                }
                else
                {
                    alert("Invalid Road ID ");
                }
                return;
            });
        }

        $.get(domain+"saveTrip/" + $( "#truck option:selected" ).text()+"/" + $( "#driver option:selected" ).val()
               +"/0/" + roadID+"/"+ $("input[type='date']").val()).then(function(response){
                if (response.Success)
                {
                    alert("Trip Saved Successfully");
                    $("input").val("");
                }
                else
                    alert("Save Trip Error: " + response.Error);
        });
    });

    showTrucks();
    showDrivers();
    showGoods();
     
});

