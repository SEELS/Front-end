$(document).ready(function(){

	var domain = "seelsapp.herokuapp.com/";
	function showDrivers()
	{
		$.get(domain+'getAllDrivers/').then(function(response)
		{
			var arr = response ;
			var text = "" ;
			$("#display").html("");
			var text = "<table><tr><th>Driver ID</th><th>Name</th><th>SSN</th><th>Rate</th></tr>" ;
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
			var arr = response ;
			var text = "" ;
			$("#display").html("");
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
			url = "showAllGoods/" ;
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
			url = "showAllGoods/" ;
		}

		var text = "";
		if (url == "showAllGoods/")
			text = showGoods();
		else if  (url == "getAllDrivers/")
			text = showDrivers();
		else 
			text = showTrucks();
	});


	$("#addTruck>button").click(function(){
		$.get(domain+$('#addTruck>input[name="truckID"]').val()+"/saveTruck").then(function(response)
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

	$("#deleteTruck>button").click(function(){
		$.get(domain+'deleteTruck/'+$('#deleteTruck>input[name="truckID"]').val()).then(function(response)
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
	 
	$("#addDriver>button").click(function(e){
		
		$.get(domain+ $('#addDriver>input[name="driverName"]').val()+"/"+ $('#addDriver>input[name="driverID"]').val()+"/" +
			 + $('#addDriver>input[name="driverPassword"]').val()+"/saveDriver").then(function(response)
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

	$("#deleteDriver>button").click(function(){
		$.get(domain+'deleteDriver/'+$('#deleteDriver>input[name="driverID"]').val()).then(function(response)
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

	$("#addGood>button").click(function(){
		$.get(domain+'addGood/'+$('#addGood>input[name="barcode"]').val()+"/" +
			  $('#addGood>input[name="goodName"]').val()+"/" + $('#addGood>input[name="company"]').val()+
			  $('#addGood>input[name="date"]').val()+"/" + $('#addGood>input[name="numGoods"]').val()).then(function(response)
		{
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

	$("#deleteGood>button").click(function(){
		$.get(domain+'deleteGood/'+$('#deleteGood>input[name="goodName"]').val()).then(function(response)
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
});