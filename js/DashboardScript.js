$(document).ready(function(){

	var domain = "https://seelsapp.herokuapp.com/";
	var currentTruck ;
	var currentDriver ;
	var currentGood ;
	var source , destination ;

	// Nav bar
    $("#goods").click(function(){
        $("#goodsMenu").slideToggle();
    });

    $("#crudAction").change(function(){
    	if ($( "#crudAction option:selected" ).val() == "report")
    	{
    		$("#good").hide();
    		$("#trip").show();
    	}
    	else
    	{
    		$("#good").show();
    		$("#trip").hide();
    	}
    });

    $("#object").change(function(){
    	if ($( "#object option:selected" ).val() == "good")
    	{
    		$("#report").hide();
    	}
    	else
    		$("#report").show();	
    });

	function showDrivers()
	{
		$.get(domain+'getAllDrivers/').then(function(response)
		{
			var arr = response.Success || [] ;
			var text = "" ;
			$("#display").html("<h1 class='loading'>Loading...</h1>");
			var text = "<table class='smallTable'><tr><th>Driver ID</th><th>Name</th><th>National ID</th><th>Rate</th></tr>" ;
			for (var i=0 ; i< arr.length ; i++)
			{
				text += "<tr><td>"+arr[i].driver_id + "</td><td>" + arr[i].name + "</td><td>" + arr[i].ssn + "</td><td>"  + arr[i].rate + "</td></tr>" ; 
			}
			text += "</table>";
			$("#display").html(text);
		});	
	}
	
	function showTrucks()
	{
		$.get(domain+'getAllTrucks/').then(function(response)
		{
			var arr = response.Success || [] ;
			var text = "" ;
			$("#display").html("<h1 class='loading'>Loading...</h1>");
			var text = "<table><tr><th>Truck ID</th><th>Current Speed</th><th>Driver ID</th><th>Name</th><th>Rate</th></tr>" ;

			for (var i=0 ; i< arr.length ; i++)
			{
				if (arr[i].driver)
				text += "<tr><td>" + arr[i].id + "</td><td>" + arr[i].currentSpeed + "</td><td>"+arr[i].driver.driver_id + "</td><td>" 
						+arr[i].driver.name + "</td><td>" + arr[i].driver.rate + "</td></tr>" ; 
				else
				{
					text += "<tr><td>" + arr[i].id + "</td><td>" + arr[i].currentSpeed + "</td><td>-</td><td>-</td><td>-</td></tr>" ; 	
				}
			}
			text += "</table>";
			$("#display").html(text);
		});			
	}
	
	function showGoods()
	{
		$.get(domain+'getAllGoods/').then(function(response)
		{
			var arr = response.Success || [] ; ;
			var text = "" ;
			$("#display").html("<h1 class='loading'>Loading...</h1>");
			var text = "<table class='smallTable'><tr><th>Barcode</th><th>Name</th><th>Company</th><th>Available Number</th></tr>" ;
			for (var i=0 ; i< arr.length ; i++)
			{
				text += "<tr><td>" + arr[i].barcode + "</td><td>" + arr[i].name + "</td><td>"+arr[i].company + "</td><td>" 
						+arr[i].num_of_goods + "</td></tr>" ; 
			}
			text += "</table>";
			$("#display").html(text);
		});	
	}

	function showTrips()
	{
		$("#display").html("<h1 class='loading'>Loading...</h1>");
		$.get(domain+'getAllTrips/').then(function(response)
		{
			var arr = response.Success || [] ; ;
			var text = "" ;
			var text = "<table class='smallTable'><tr><th>Trip ID</th><th>Driver</th><th>Truck</th><th>Date</th></tr>" ;
			for (var i=0 ; i< arr.length ; i++)
			{

				// CONVERT TIMESTAMP TO DATE
				var fullDate = new Date(arr[i].date) ;
				var month = fullDate.getUTCMonth() + 1; //months from 1-12
				var day = fullDate.getUTCDate();
				var year = fullDate.getUTCFullYear();
				var date = month + "/" + day + "/" + year ;

				text += "<tr><td>" + arr[i].trip_id + "</td><td>" + arr[i].driver.name + "</td><td>" + arr[i].truck.id
					 + "</td><td>" + date + "</td></tr>" ;

			}

			$("#display").html(text);
		});	
	}
	
	function viewTripReport(tripID)
	{
		$.get(domain+'getTrip/'+tripID).then(function(response)
		{
			if (response.Success)
			{
				// CONVERT TIMESTAMP TO DATE
				var fullDate = new Date(response.Success.date) ;
				var month = fullDate.getUTCMonth() + 1; //months from 1-12
				var day = fullDate.getUTCDate();
				var year = fullDate.getUTCFullYear();
				var date = month + "/" + day + "/" + year ;

				var text = "<table style='width:82.25%'><col style='width:10%'><col style='width:50%'>";
              	text += "<tr><th colspan='2'><h1>Trip Report</h1></th></tr><tr><td><h3>ID:</h3></td><td>"
             		 + response.Success.trip_id + "</td></tr><tr><td><h3>Driver:</h3></td><td>"+ response.Success.driver.name
             		 + " ( ID: " + response.Success.driver.driver_id + ")" + "</td></tr><tr><td><h3>Trip Rate:</h3></td><td>"
             		 + response.Success.rate + "</td></tr><tr><td><h3>Date:</h3></td><td>" + date + "</td></tr><tr><td>"
              		 + "<h3>Road: </h3></td><td>"+response.Success.road.name + "</td></tr><tr><td colspan='2'><div id='map'></div>"
              		 + "</td></tr>" ;
               	
              	// TRIP GOODS:
              /*	text += "<tr><td><h3>Goods:</h3></td><td style='padding:0px;'><table style='width:100%; margin-top:0px;"
              		 + "margin-bottom:0px;border-top-right-radius:0px;border-top-left-radius:0px;'><col width='65'>"
              		 + "<col width='60%'><col width='100%'><tr><th>Barcode</th><th>Name</th><th>Quantity</th></tr>";
              	
              	$.get(domain+'getTripGoods/' + tripID).then(function(goods) {
    				goods = goods.Success || [] ;
    				
    				for (var i=0 ; i<goods.length ; i++)
	              	{
	              		text += "<tr value='"+goods[i].barcode+"'><td>" + goods[i].barcode
	              			 + "</td><td>"+goods[i].name + "</td><td>" + trips[i].num_of_goods+"</td></tr>";
	              	}
	            */ 
	            text += "</table></td></tr></table>";
				$("#display").html(text);

	           	// VIEW THE PATH OF THE TRIP ON THE MAP
              	var map = initMap();

              	$.get(domain+"getRoad/" +response.Success.road.id ).then(function(road)
				{
		            var road = road.Success;
		            var roadFlightPath = highlightRoad(road);
		            roadFlightPath.setMap(map);
				});
			//	});

			}
			else
				alert(response.Error);
		});
	}

	$("#go").click(function(){
		
		var url = "" ;
		var crudAction = $('#crudAction :selected').text();
		var object = $('#object :selected').text();
				
		$(".formContents").hide();

		if (crudAction == "Add" && object == "Truck"){
			$("#addTruck").show();
			url = "getAllTrucks/" ;
		}
		else if (crudAction == "Add" && object == "Driver"){
			$("#addDriver").show();
			url = "getAllDrivers/" ;
		}
		else if (crudAction == "Add" && object == "Goods"){
			$("#addGood").show();
			url = "getAllGoods/" ;
		}
		else if (crudAction == "Update" && object == "Truck"){
			$("#updateTruck").show();
			url = "getAllTrucks/" ;
		}
		else if (crudAction == "Update" && object == "Driver"){
			$("#updateDriver").show();
			url = "getAllDrivers/" ;
		}
		else if (crudAction == "Update" && object == "Goods"){
			$("#updateGood").show();
			url = "getAllGoods/" ;
		}
		else if (crudAction == "Delete" && object == "Truck"){
			$("#deleteTruck").show();
			url = "getAllTrucks/" ;
		}
		else if (crudAction == "Delete" && object == "Driver"){
			$("#deleteDriver").show();
			url = "getAllDrivers/" ;
		}
		else if (crudAction == "Delete" && object == "Goods"){
			$("#deleteGood").show();
			url = "getAllGoods/" ;
		}
		else if (crudAction == "View Report" && object == "Truck"){
			$("#reportTruck").show();
			url = "getAllTrucks/" ;
		}
		else if (crudAction == "View Report" && object == "Trip"){
			$("#reportTrip").show();
			url = "getAllTrips/" ;
		}
		else if (crudAction == "View Report" && object == "Driver"){
			$("#reportDriver").show();
			url = "getAllDrivers/" ;
		}

		var text = "";
		if (url == "getAllGoods/")
			text = showGoods();
		else if  (url == "getAllDrivers/")
			text = showDrivers();
		else if (url == "getAllTrucks/")
			text = showTrucks();
		else if (url == "getAllTrips/")
			text = showTrips();
	});


	$("#addTruck>tbody>tr>td>button").click(function(){
		$.get(domain+$('#addTruck>tbody>tr>td>input[name="truckID"]').val()+"/saveTruck").then(function(response)
		{
			if (response.Success)
			{	
				alert("Truck Added Successfully") ;
				$("input[type='text']").val("");
				showTrucks();
			}
			else
				alert(response.Error);
		});
	});
 
	$("#updateTruck>tbody>tr>td>button[value='Update']").click(function(){
		
		$.get(domain+"getTruck/"+$('#updateTruck>tbody>tr>td>input[name="truckID"]').val()).then(function(response){
			$('#updateTruck>tbody>tr>td>input[name="truckID"]').val(response.Success.id);
			currentTruck = response.Success.id ;
		});

		$("#updateTruck>tbody>tr>td>button[value='Update']").hide();
		$("#updateTruck>tbody>tr>td>button[value='Save']").show();
	});

	$("#updateTruck>tbody>tr>td>button[value='Save']").click(function(){
		$.get(domain+"updateTruck/"+currentTruck+"/"+$('#updateTruck>tbody>tr>td>input[name="truckID"]').val()).then(function(response)
		{
			if (response.Success)
			{	
				alert("Truck Updated Successfully") ;
				$("input[type='text']").val("");
				showTrucks();
			}
			else
				alert(response.Error);
		});
	});

	$("#deleteTruck>tbody>tr>td>button").click(function(){
		console.log(domain+'deleteTruck/'+$('#deleteTruck>tbody>tr>td>input[name="truckID"]').val());
		$.get(domain+'deleteTruck/'+$('#deleteTruck>tbody>tr>td>input[name="truckID"]').val()).then(function(response)
		{
			if (response.Success)
			{
				alert("Truck Deleted Successfully") ;
				$("input[type='text']").val("");
				showTrucks();
			}
			else
				alert(response.Error);
		});
	});
	 
	$("#addDriver>tbody>tr>td>button").click(function(e){
		var pass = $('#addDriver>tbody>tr>td>input[name="driverPassword"]').val();
		$.get(domain+ $('#addDriver>tbody>tr>td>input[name="driverName"]').val()+"/"+ $('#addDriver>tbody>tr>td>input[name="driverID"]').val()+"/" +
			 pass+"/saveDriver").then(function(response)
		{
			if (response.Success)
			{
				alert("Driver Added Successfully") ;
				$("input[type='text']").val("");
				showDrivers();
			}
			else
				alert(response.Error);
		});
	});


	$("#updateDriver>tbody>tr>td>button[value='Update']").click(function(){

		$.get(domain+"getDriver/"+$('#updateDriver>tbody>tr>td>input[name="driverID"]').val()).then(function(response){
			$('#updateDriver>tbody>tr>td>input[name="driverID"]').val(response.Success.driver_id);
			$('#updateDriver>tbody>tr>td>input[name="driverName"]').val(response.Success.name);
			$('#updateDriver>tbody>tr>td>input[name="driverPassword"]').val(response.Success.password);

			currentDriver = response.Success.driver_id ;
			$('#updateDriver>tbody>tr>td>input').show();
			$('#updateDriver>tbody>tr>td>label').show();
		});

		$("#updateDriver>tbody>tr>td>button[value='Update']").hide();
		$("#updateDriver>tbody>tr>td>button[value='Save']").show();
	});


	$("#updateDriver>tbody>tr>td>button[value='Save']").click(function(){
		$.get(domain+currentDriver+"/"+ $('#updateDriver>tbody>tr>td>input[name="driverName"]').val()+"/"
			 + $('#updateDriver>tbody>tr>td>input[name="driverID"]').val()+"/"
			 + $('#updateDriver>tbody>tr>td>input[name="driverPassword"]').val()+"/updateDriver").then(function(response)
		{
			if (response.Success)
			{
				alert("Driver Updated Successfully") ;
				$("input[type='text']").val("");
				showDrivers();
			}
			else
				alert(response.Error);
		});
	});

	$("#deleteDriver>tbody>tr>td>button").click(function(){
		$.get(domain+'deleteDriver/'+$('#deleteDriver>tbody>tr>td>input[name="driverID"]').val()).then(function(response)
		{
			if (response.Success)
			{	alert("Driver Deleted Successfully") ;
				$("input[type='text']").val("");
				showDrivers();
			}
			else
				alert(response.Error);
		});
	});

	$("#addGood>tbody>tr>td>button").click(function(){
		$.get(domain+'saveGoods/'+$('#addGood>tbody>tr>td>input[name="goodName"]').val()+"/" +
			  $('#addGood>tbody>tr>td>input[name="company"]').val()+"/" + $('#addGood>tbody>tr>td>input[name="barcode"]').val()+"/"+
			  $('#addGood>tbody>tr>td>input[type="date"]').val()+"/" + $('#addGood>tbody>tr>td>input[name="numGoods"]').val()).then(function(response)
		{
			console.log($('#addGood>tbody>tr>td>input[type="date"]').val());
			if (response.Success)
			{
				alert("Good Added Successfully") ;
				$("input[type='text']").val("");
				showGoods();
			}
			else
				alert(response.Error);
		});
	});

	$("#updateGood>tbody>tr>td>button[value='Update']").click(function(){
		
		$.get(domain+"getGood/"+$('#updateGood>tbody>tr>td>input[name="goodName"]').val()).then(function(response){
			$('#updateGood>tbody>tr>td>input[name="goodName"]').val(response.Success.id);
			$('#updateGood>tbody>tr>td>input[name="barcode"]').val(response.Success.id);
			$('#updateGood>tbody>tr>td>input[name="company"]').val(response.Success.id);
			$('#updateGood>tbody>tr>td>input[name="date"]').val(response.Success.name);
			$('#updateGood>tbody>tr>td>input[name="numGoods"]').val(response.Success.password);

			currentGood = response.Success.id ;
			$('#updateGood>tbody>tr>td>input').show();
			$('#updateGood>tbody>tr>td>tbody>tr>td>label').show();
		});

		$("#updateGood>tbody>tr>td>button[value='Update']").hide();
		$("#updateGood>tbody>tr>td>button[value='Save']").show();
	});


	$("#updateGood>tbody>tr>td>button[value='Save']").click(function(){
		$.get(domain+currentGood+"/"+'updateGood/'+$('#updateGood>tbody>tr>td>input[name="barcode"]').val()+"/" +
			  $('#updateGood>tbody>tr>td>input[name="goodName"]').val()+"/" + $('#updateGood>tbody>tr>td>input[name="company"]').val()+
			  $('#updateGood>tbody>tr>td>input[name="date"]').val()+"/" + $('#updateGood>tbody>tr>td>input[name="numGoods"]').val()).then(function(response)
		{
			if (response.Success)
			{
				alert("Good Updated Successfully") ;
				$("input[type='text']").val("");
				showGoods();
			}
			else
				alert(response.Error);
		});
	});


	$("#deleteGood>tbody>tr>td>button").click(function(){
		$.get(domain+'deleteGood/'+$('#deleteGood>tbody>tr>td>input[name="barcode"]').val()).then(function(response)
		{
			if (response.Success)
			{
				alert("Good Deleted Successfully") ;
				$("input[type='text']").val("");
				showGoods();
			}
			else
				alert(response.Error);
		});
	});

	$("#reportDriver>tbody>tr>td>button").click(function(){
		$("#display").html("<h1 class='loading'>Loading...</h1>");
		$.get(domain+'getDriver/'+$('#reportDriver>tbody>tr>td>input[name="driverID"]').val()).then(function(response)
		{
			if (response.Success)
			{

				$.get(domain+"driverCompletedTrip/" + response.Success.driver_id).then (function (trips) 
				{
					trips = trips.Success || [] ;
					var text = "<table style='width:82.25%'><col style='width:10%'><col style='width:50%'>";

              		text += "<tr><th colspan='2'><h1>Driver Report</h1></th></tr><tr><td><h3>Name:</h3></td><td>"
              			 + response.Success.name + "</td></tr><tr><td><h3>ID:</h3></td><td>"+ response.Success.driver_id 
              			 + "</td></tr><tr><td><h3>Rate:</h3></td><td>" + response.Success.rate
              			 + "</td></tr><tr><td><h3>Completed Trips:</h3></td>" ;

               		if (trips.length == 0)
              		{
              			text += "<td>None</td>" ;
              			text += "</table></td></tr></table>";
						$("#display").html(text);
						return ;
              		}

              		// TRIPS DETAILS:
              		text += "<td style='padding:0px;'><table style='width:100%; margin-top:0px;margin-bottom:0px;"
              			 + "border-top-right-radius:0px;border-top-left-radius:0px;'><col width='65'><col width='60%'>"
              			 + "<col width='100%'><tr><th>Date</th><th>Road</th><th>Rate</th></tr>";
              		for (var i=0 ; i<trips.length ; i++)
              		{
		             	// CONVERT TIMESTAMP TO DATE
						var fullDate = new Date(trips[i].date) ;
						var month = fullDate.getUTCMonth() + 1; //months from 1-12
						var day = fullDate.getUTCDate();
						var year = fullDate.getUTCFullYear();
						var date = month + "/" + day + "/" + year ;
              			text += "<tr value='"+trips[i].trip_id+"' onclick='viewTripReport("+trips[i].trip_id+")'><td>" + date
              				 + "</td><td>"+trips[i].road.name + "</td><td>" + trips[i].rate+"</td></tr>";
              		}

              		text += "</table></td></tr></table>";
					$("#display").html(text);
              	});

			}
			else
				alert(response.Error);
		});
	});

	$("#reportTrip>tbody>tr>td>button").click(function(){
		$("#display").html("<h1 class='loading'>Loading...</h1>");
		viewTripReport($('#reportTrip>tbody>tr>td>input[name="tripID"]').val());
		
	});

});