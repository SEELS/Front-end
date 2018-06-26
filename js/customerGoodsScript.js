$(document).ready(function (){

//	var map = initMap();

	var domain = "https://seelsapp.herokuapp.com/";

	$("#go").click(function(){	

		var tripID = $("#trip").val();
		// GET TRUCK FOR SELECTED TRIP
		$.get(domain+'getTripTruck/' + tripID).then(function(response) {
			// SHOW THE TRUCK FOR THE SELECTED TRIP ON THE MAP
			if (response.Success)
			{
				truckID = response.Success;

				if (response.Values == "Completed")
				{
					alert("The Trip is Completed");
					return ;
				}
				else if (response.Values == "created" || response.Values == "Created")
				{
					alert("The trip hasn't started yet");
				}
				else // Trip has started
				{
					// 1) GET LOCATION AND ADD MARKER
					$.get(domain+'viewCurrentTruckLocation/' + truckID).then(function(response2) {
						if (response2.Success)
						{
							lon = response2.Success.lon;
							lat = response.Success.lat;
							var flightPath = addMarker(new google.maps.LatLng(lat , lon) ,truckID);
							// 2) UPDATE AND DRAW PATH
							var myVar = setInterval(function(){updatePath(truckID, flightPath);}, 1000);
						}
						else
						{
							alert("There's no Trip with this ID");
						}
					});
				}	
			}
			else
			{
				alert("There's no Trip with this ID");
			}
		});

	});

});
