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
		$.get(domain+'viewTruckLocation/' + truckID).then(function(response) {
				lon = response.Success.lon;
				lat = response.Success.lat;
				var flightPath = addMarker(new google.maps.LatLng(lat , lon) ,trucks[i].id);

				// 2) UPDATE AND DRAW PATH
				var myVar = setInterval(function(){updatePath(truckID, flightPath);}, 1000);
			});
		
		// SHOW GOODS
		$.get(domain+'getGoods/' + truckID).then(function(response) {

			var goods = "<table><tr><th>#</th><th>Barcode</th><th>Good Name</th><th>Quantity<th></tr>";

			for (var i=0 ; i<response.length ; i++)
			{
				goods += "<tr><td>" + i + "</td><td>"+response[i].barcode+"</td><td>"+response[i].name+"</td><td>"
					  +  response[i].count+"</td></tr>";
			}

			goods+= "</table>";
			$("#displayGoods").html(goods);
		});

	});

});
