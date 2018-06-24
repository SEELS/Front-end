$(document).ready(function (){

//	var map = initMap();

	var domain = "https://seelsapp.herokuapp.com/";

	$("#go").click(function(){	

		var tripID = $("#trip").val();
		
		// GET TRUCK FOR SELECTED TRIP
		$.get(domain+'getTripTruck/' + tripID).then(function(truckID) {
			// SHOW THE TRUCK FOR THE SELECTED TRIP ON THE MAP
			// 1) GET LOCATION AND ADD MARKER
			$.get(domain+'viewCurrentTruckLocation/' + truckID).then(function(response) {
				lon = response.Success.lon;
				lat = response.Success.lat;
				var flightPath = addMarker(new google.maps.LatLng(lat , lon) ,trucks[i].id);
				// 2) UPDATE AND DRAW PATH
				var myVar = setInterval(function(){updatePath(truckID, flightPath);}, 1000);
			});
		});

	});

});
