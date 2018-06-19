$(document).ready(function (){

	//var map = initMap();

	var domain = "https://seelsapp.herokuapp.com/";


	$.get(domain+"getAllGoods").then(function(response) 
	{
		var arr = response ;
		var goods = "" ;
            
        for (var i=0 ; i< arr.length ; i++)
		{
			goods += "<option value='"+arr[i].barcode+"'>"+arr[i].name + "</option>" ; 
		}
			
		$("#goodsList").html(goods);
		
	});
	
	$("#go").click(function(){
		var goodDetails = "" ;
		
		// LOCATE THE GOODS ON MAP AND DRAW PATH OF EACH TRIP
		$.get(domain+"getGoodTrips/" + barcode).then(function(response){
			var trips = response;
			var trucks = [] ;
			for (var i=0 ; i<trips.length ; i++)
			{
				trucks.push(trips[i].truck) ;
			}
			showActiveTrucks(trucks);
		});

		// DISPLAY GOOD'S DETAILS
		$.get(domain+"getGoodDetails/" + barcode).then(function(response){
			
			var good = response; 
			goodDetails += "<h4>Barcode: </h4>"+ good.barcode;
			goodDetails += "<br><h4>Name: </h4>"+ good.name;
			goodDetails += "<br><h4>Available Count: </h4>"+good.count;
		});
		$("#displayGood").html($("#displayGood").html()+goodDetails);
		$("#displayGood").show();

	});

});
