$(document).ready(function(){

	var domain = "https://seelsapp.herokuapp.com/";
	var currentTruck ;
	var currentDriver ;
	var currentGood ;

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
		$.get(domain+'getAllGoods/').then(function(response)
		{
			var arr = response ;
			var text = "" ;
			$("#display").html("");
			var text = "<table><tr><th>Barcode</th><th>Name</th><th>Company</th><th>Available Number</th></tr>" ;
			for (var i=0 ; i< arr.length ; i++)
			{
				text += "<tr><td>" + arr[i].barcode + "</td><td>" + arr[i].name + "</td><td>"+arr[i].company + "</td><td>" 
						+arr[i].num_of_goods + "</td></tr>" ; 
			}
			text += "</table>";
			$("#display").html(text);
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

		var text = "";
		if (url == "getAllGoods/")
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
 
	$("#updateTruck>button[value='Update']").click(function(){
		
		$.get(domain+"getTruck/"+$('#updateTruck>input[name="truckID"]').val()).then(function(response){
			$('#updateTruck>input[name="truckID"]').val(response.Success.id);
			currentTruck = response.Success.id ;
		});

		$("#updateTruck>button[value='Update']").hide();
		$("#updateTruck>button[value='Save']").show();
	});

	$("#updateTruck>button[value='Save']").click(function(){
		$.get(domain+"updateTruck/"+currentTruck+"/"+$('#updateTruck>input[name="truckID"]').val()).then(function(response)
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
		var pass = $('#addDriver>input[name="driverPassword"]').val();
		$.get(domain+ $('#addDriver>input[name="driverName"]').val()+"/"+ $('#addDriver>input[name="driverID"]').val()+"/" +
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


	$("#updateDriver>button[value='Update']").click(function(){

		$.get(domain+"getDriver/"+$('#updateDriver>input[name="driverID"]').val()).then(function(response){
			$('#updateDriver>input[name="driverID"]').val(response.Success.id);
			$('#updateDriver>input[name="driverName"]').val(response.Success.name);
			$('#updateDriver>input[name="driverPassword"]').val(response.Success.password);

			currentDriver = response.Success.id ;
			$('#updateDriver>input').show();
			$('#updateDriver>label').show();
		});

		$("#updateDriver>button[value='Update']").hide();
		$("#updateDriver>button[value='Save']").show();
	});


	$("#updateDriver>button[value='Save']").click(function(){
		$.get(domain+currentDriver+"/"+ $('#addDriver>input[name="driverName"]').val()+"/"+ $('#addDriver>input[name="driverID"]').val()+"/" +
			 + $('#addDriver>input[name="driverPassword"]').val()+"/updateDriver").then(function(response)
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
		$.get(domain+'saveGoods/'+$('#addGood>input[name="barcode"]').val()+"/" +
			  $('#addGood>input[name="goodName"]').val()+"/" + $('#addGood>input[name="company"]').val()+"/"+
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

	$("#updateGood>button[value='Update']").click(function(){
		
		$.get(domain+"getGood/"+$('#updateGood>input[name="goodName"]').val()).then(function(response){
			$('#updateGood>input[name="goodName"]').val(response.Success.id);
			$('#updateGood>input[name="barcode"]').val(response.Success.id);
			$('#updateGood>input[name="company"]').val(response.Success.id);
			$('#updateGood>input[name="date"]').val(response.Success.name);
			$('#updateGood>input[name="numGoods"]').val(response.Success.password);

			currentGood = response.Success.id ;
			$('#updateGood>input').show();
			$('#updateGood>label').show();
		});

		$("#updateGood>button[value='Update']").hide();
		$("#updateGood>button[value='Save']").show();
	});


	$("#updateGood>button[value='Save']").click(function(){
		$.get(domain+currentGood+"/"+'updateGood/'+$('#updateGood>input[name="barcode"]').val()+"/" +
			  $('#updateGood>input[name="goodName"]').val()+"/" + $('#updateGood>input[name="company"]').val()+
			  $('#updateGood>input[name="date"]').val()+"/" + $('#updateGood>input[name="numGoods"]').val()).then(function(response)
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


	$("#deleteGood>button").click(function(){
		$.get(domain+'deleteGood/'+$('#deleteGood>input[name="barcode"]').val()).then(function(response)
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