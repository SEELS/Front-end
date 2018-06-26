$(document).ready(function (){

	//var map = initMap();

	var domain = "https://seelsapp.herokuapp.com/";


	$.get(domain+"getAllGoods").then(function(response) 
	{
		var arr = response.Success ;
		var goods = "" ;
            
        for (var i=0 ; i< arr.length ; i++)
		{
			goods += "<option value='"+arr[i].barcode+"'>"+arr[i].name + "</option>" ; 
		}
			
		$("#goodsList").html(goods);
		
	});
	
	$("#go").click(function(){
		var goodDetails = "" ;
		var barcode = $("#goodsList").val();
		console.log(domain+"getGoodTrips/" + barcode);

		// LOCATE THE GOODS ON MAP AND DRAW PATH OF EACH TRIP
		$.get(domain+"getGoodTrips/" + barcode).then(function(response){
			var trips = response.Success;
			var trucks = [] ;
			var trucksList = "";
			console.log(trips);
			for (var i=0 ; i<trips.length ; i++)
			{
				trucks.push(trips[i].truck) ;
				trucksList+=trips[i].truck.id+"<br>";
			}
			clearMarkers();
			showActiveTrucks(trucks);
			$("#displayTrucks").html("<h3>Selected Trucks</h3>"+trucksList);
			$("#displayTrucks").show();

		});

		// DISPLAY GOOD'S DETAILS
		$.get(domain+"getGood/" + barcode).then(function(response){
			
			var good = response.Success; 
			console.log(good);
			goodDetails += "<h4>Barcode: </h4>"+ good.barcode;
			goodDetails += "<br><h4>Name: </h4>"+ good.name;
			goodDetails += "<br><h4>Company: </h4>"+ good.company;
			goodDetails += "<br><h4>Available Count: </h4>"+good.num_of_goods;
			console.log(goodDetails);
			$("#displayGood").html("<h3>Selected Good</h3>"+goodDetails);
			$("#displayGood").show();

		});
		
	});

});
