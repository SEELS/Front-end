$(document).ready(function(){

	var domain = "https://seelsapp.herokuapp.com/";
	var currentTruck ;
	var currentDriver ;
	var currentGood ;

	// Nav bar
    $("#goods").click(function(){
        $("#goodsMenu").slideToggle();
    });

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

});