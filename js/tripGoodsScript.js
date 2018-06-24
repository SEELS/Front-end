$(document).ready(function (){

//	var map = initMap();

	var domain = "https://seelsapp.herokuapp.com/";


	$.get(domain+"getActiveTrucks").then(function(response) 
	{
		var arr = response ;
		var trips = "" ;
            
        for (var i=0 ; i< arr.length ; i++)
		{
			trips += "<option value='"+arr[i].id+"'>"+arr[i].driver.name +"," + arr[i].id + "</option>" ; 
		}
			
		$("#trip").html(trips);
		
	});
	

	$("#go").click(function(){	

		// SHOW THE TRUCK FOR THE SELECTED TRIP ON THE MAP
		var truckID = $("#trip").val();
		// 1) GET LOCATION AND ADD MARKER
		$.get(domain+'viewCurrentTruckLocation/' + truckID).then(function(response) {
				lon = response.Success.lon;
				lat = response.Success.lat;
				var flightPath = addMarker(new google.maps.LatLng(lat , lon) ,trucks[i].id);

				// 2) UPDATE AND DRAW PATH
				var myVar = setInterval(function(){updatePath(truckID, flightPath);}, 1000);
			});
		
		// SHOW GOODS
		$.get(domain+'getGoodByTruckID/' + truckID).then(function(response) {

			var goods = "<table><tr><th class='num'>#</th><th class='barcode'>Barcode</th><th class='name'>Good Name</th>"
						+"<th class='qty'>Quantity</th></tr>";

			for (var i=0 ; i<response.length ; i++)
			{
				goods += "<tr><td class='num'>" + i + "</td><td class='barcode'>"+response[i].barcode+"</td>"
					  +  "<td class='name'>"+response[i].name+"</td><td class='qty'>" +  response[i].count+"</td></tr>";
			}

			goods+= "</table>";
			$("#displayGoods").html(goods);
		});

	});

});
