$("document").ready(function(){

    var map = initMap();
    //var domain = "http://localhost:8080/";
    var domain = "https://seelsapp.herokuapp.com/";
    var lat ,lng;
    var roadLine , roadID=-1;
    var goodsArea = false ;
    var goodsArr = [] ;
    var goodsParam = "";
 
    // initialize <select>
    function showDrivers()
	{
		$.get(domain+'getAllDrivers/').then(function(response)
		{
			var arr = response.Success ;
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
            var arr = response.Success ;
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
            var arr = response.Success ;
            var goods = "";
			for (var i=0 ; i< arr.length ; i++)
			{
                goods+= "<option value='"+arr[i].barcode+"'>" + arr[i].name+ "</option>";
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
        roadID = -1 ;
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
                roads+="<option value=" +  response[i].id + ">" + response[i].name + "</option>";
            }
            $("#exRoads").html(roads);
            roadID = $( "#exRoads" ).val();
        });
    });

    // Highlights the selected road on the map (existing)
    $("#showRoad").click(function(){
        $.get(domain+"getRoad/" + $( "#exRoads option:selected" ).val()).then(function(response)
		{
            var road = response.Success;
         //   roadLine.setMap(null);      // Remove the old road
            roadLine = highlightRoad(road);
		});
    });

    // update road id on change of "select" value
    $('#exRoads').on('change', function() {
        roadID = this.value;
      })

    // Max Num available of the selected good
     $('#goodName').on('change', function() {
        var barcode = $('#goodName :selected').val() ;
        console.log(domain+"getAvaliablityOfNumOfGoods/" +barcode);
        $.get(domain+"getAvaliablityOfNumOfGoods/" +barcode).then(function(response){
            $("#goodsCount").attr("max" , response.Success);
        });
      })

    // Add goods to trip
    /* Put the goods with their counts in an array then add it to the trip in "AddTrip"*/
    $("#addGood").click(function(){
        var name =  $('#goodName :selected').text();
        var count = $("#goodsCount").val();
        var barcode = $('#goodName :selected').val() ;
        var available = 0 ;

        $.get(domain+"getAvaliablityOfNumOfGoods/" +barcode).then(function(response){
            available = response.Success ;
            var temp = Number($("#"+name+">.count").html()) || 0;
            var total = Number(temp) + Number(count);
            if ( total > available)
            {
                alert("Maximum number available is " + available);
                return;
            }
            else if (total < 0)
            {
                alert("Invalid Number!");
                return;
            }
            else if (goodsArr[name])
            {
                $("#"+name+">.count").html(Number($("#"+name+">.count").html())+Number(count));
                goodsArr[name] += count ;
            }
            else
            {
                goodsArr[name] = count ;
                var tr = "<tr id=" + name +"><td>"+name+"</td><td class='count'>"+count+"</td><td>"+available+"</td></tr>";
                $("#goodsTable").append(tr);
            }
            $("#goodsTable").show();
        });
    })

    //Add trip -> save road if new then save the trip
    $("#submit").click(function(){

        // PREPARE THE GOODS PARAMETER STRING
        for (var good in goodsArr) 
        {
            if (goodsArr[good] == 0)
                continue; 
            goodsParam += good + ":" + goodsArr[good] +",";
        }

        // remove the last "," placed after the last item
        goodsParam = goodsParam.substring(0, goodsParam.length - 1); 


        if (roadID == -1)
        {
            // SAVE NEW ROAD
            $.get(domain+"saveRoad/"+$("#roadName").val()+"/"+$("#destinationLat").val()+"/"+$("#destinationLng").val()+"/"
            +$("#sourceLat").val()+"/"+$("#sourceLng").val()+"/1/").then(function(response){
                if (response.Success)
                {
                    roadID = response.Success;
                    $.get(domain+"saveTrip/" + $( "#truck option:selected" ).text()+"/" + $( "#driver option:selected" ).val()+
                           "/0/" + roadID+"/" + $("input[type='date']").val()+"/" + goodsParam).then(function(response2){
                            if (response2.Success)
                            {
                                alert("Trip Saved Successfully");
                                $("input").val("");
                            }
                            else
                                alert("Save Trip Error: " + response2.Error);
                    });
                }
                else
                {
                    alert("Invalid Road ID ");
                }
                //return;
            });
        }
        else
        {
            $.get(domain+"saveTrip/" + $( "#truck option:selected" ).text()+"/" + $( "#driver option:selected" ).val()+
              "/0/" + roadID+"/" + $("input[type='date']").val()+"/" + goodsParam).then(function(response){
                if (response.Success)
                {
                    alert("Trip Saved Successfully");
                    $("input").val("");
                }
                else
                    alert("Save Trip Error: " + response.Error);
            });
        }    
    });

    $("#goodsArea").click(function(){
        if (!goodsArea)
        {
            goodsArea = true ;
            $("aside>*").hide();
            $("#goodsArea").css("border-style" , "none");
            $("#goodsArea").show();
            $("#doneGoods").show();
            $("#goodsTable").show();   

            var barcode =  $('#goodName').find("option:first-child").val() ;
            console.log(domain+"getAvaliablityOfNumOfGoods/" +barcode);
            $.get(domain+"getAvaliablityOfNumOfGoods/" +barcode).then(function(response){
                 $("#goodsCount").attr("max" ,response.Success);
            });
        }
    });

    $("#doneGoods").click(function(){
        $("#goodsArea").css("border-style" , "solid");
        $("#goodsArea").show();
        $("aside>*").show();
        $("#existingRoadDetails").hide();
        $("#newRoadDetails").hide();
        $("#doneGoods").hide();
        $("#goodsTable").hide();
        goodsArea = false ;
    });
    

    showTrucks();
    showDrivers();
    showGoods();
     
});

