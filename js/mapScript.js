var map ;
var markers=[];
var flightPath=[];
var flightPlanCoordinates = [];		// 2D Array -> array of flightPlanCoordinates for each truck
var longitude = [] ;
var latitude = [];

// Sets the map on all markers in the array.
function setMapOnAll(map) {
   for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
   }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
	setMapOnAll(null);
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function addMarker(location , truckId) {
		
	flightPlanCoordinates[truckId] = [];
	flightPlanCoordinates[truckId].push(location);

	flightPath[truckId] = new google.maps.Polyline({
          path: flightPlanCoordinates[truckId],
          geodesic: true,
          strokeColor: getRandomColor(),
          strokeOpacity: 1.0,
          strokeWeight: 2
        });
	
	markers[truckId] = new google.maps.Marker({
          position: location,
		  map: map
    });	
    flightPath[truckId].setMap(map);
	markers[truckId].setPosition(location);

}


function changeMarkerPosition(marker, lat, lng) {
	var latlng = new google.maps.LatLng(lat, lng);
	marker.setPosition(latlng);
}

function initMap() {
	markers=[];
	flightPath=[];
	flightPlanCoordinates = [];		// 2D Array -> array of flightPlanCoordinates for each truck
	longitude = [] ;
	latitude = [];
	
	var mapOptions = {
		center: new google.maps.LatLng(30.06263, 31.24967),
		zoom: 3,
		mapTypeId : 'terrain'
	}
	map = new google.maps.Map(document.getElementById("map"), mapOptions);
}


function getPosition(truckId) {

	$.get("http://localhost:8080/viewTruckLocation/" + truckId).then (function(response) {
		data = response;
		latitude[truckId] = data.lat;
		longitude[truckId] = data.lon;
	});
}

function updatePath(truckId) {
	
	// get existing path
	var path = flightPath[truckId].getPath();
	
	// add new point
	getPosition(truckId);
	path.push(new google.maps.LatLng(latitude[truckId] , longitude[truckId]));
	
	// Update Path	
	flightPath[truckId].setPath(path);

	changeMarkerPosition(markers[truckId], latitude[truckId], longitude[truckId]);
}

function showActiveTrucks(trucks)
{
	initMap();
	trips=[];
 	for( i=0; i<trucks.length ; i++)
	{
		addMarker(new google.maps.LatLng(trucks[i].latitude , trucks[i].longitude) ,trucks[i].id);
		//var temp = getTrip(trucks[0].id);
		//alert("Temp:  " + temp);
		//getRoad(temp);
		getTripRoad(trucks[0].id);
		longitude[trucks[i].id] = trucks[i].longitude;
		latitude[trucks[i].id] = trucks[i].latitude;
	}

	var myVar = setInterval(function(){
		for (var i=0 ; i<trucks.length; i++)
		{
			var x = trucks[i].id ;
			updatePath(x, flightPath[x]);
		}
	}, 1000);
	
	/*var accidentCheck = setInterval(function(){
		for (var i=0 ; i<trucks.length; i++)
		{
			for (var j=0 ; j<trucks.length; j++)
			{
				if (i==j)
					continue;
				 $.get('http://localhost:8080/'+trucks[i].id+'/'+trucks[j].id+'/changeInSpeed/').then(function(reponse){
					if (response == true) 
						alert("Possible Accident for Trucks: " + trucks[i].id + ", " + trucks[j].id);
				 });
			}			
		}
	}, 10000);
	*/
	

}

function showSpecificTruck(truckId)
{
	clearMarkers();
	markers[truckId].setMap(map);
}


function highlightRoad(road)
{
	var roadFlightPlanCoordinates  =[]; 
	
	// add new point
	for (var i=0 ; i<road.length; i++)
	{
		var point = {lat: road[i].lat , lng:road[i].lon};
		roadFlightPlanCoordinates.push(point);
	}

	// Update Path	
	var roadFlightPath = new google.maps.Polyline({
	  path: roadFlightPlanCoordinates,
	  geodesic: true,
	  strokeColor: getRandomColor(),
	  strokeOpacity: 1.0,
	  strokeWeight: 2
	});
	roadFlightPath.setMap(map);
}
/*
function getRoad(tripId)
{
	alert("Road: " + tripId);
	$.get('http://localhost:8080/getRoad/'+tripId).then(function(response)
	{
		var road = response;
		highlightRoad(road);
		alert("Done");
	});
}

function getTrip(id)
{
	alert("ID: " + id);
	$.get('http://localhost:8080/'+id+'/getTruckTrip/').then(function(response)
	{
		alert("tesp: " + response);
		return response;
	});
}
*/
function getTripRoad(id)
{
	$.get('http://localhost:8080/'+id+'/getTruckTrip/').then(function(response)
	{
		$.get("http://localhost:8080/getRoad/" + response).then(function(response2)
		{
			var road = response2;
			highlightRoad(road);
		});
	});
}