$(document).ready(function(){

	$("#go").click(function(){
		
		var url = "" ;
		var crudAction = $('#crudAction :selected').text();
		var object = $('#object :selected').text();
				
		$(".formContents").hide();

		if (crudAction == "Add" && object == "Truck"){
			$("#addTruck").show();
			url = "showAllTrucks/" ;
		}
		else if (crudAction == "Add" && object == "Driver"){
			$("#addDriver").show();
			url = "showAllDrivers/" ;
		}
		else if (crudAction == "Add" && object == "Goods"){
			$("#addGood").show();
			url = "showAllGoods/" ;
		}
		else if (crudAction == "Delete" && object == "Truck"){
			$("#deleteTruck").show();
			url = "showAllTrucks/" ;
		}
		else if (crudAction == "Delete" && object == "Driver"){
			$("#deleteDriver").show();
			url = "showAllDrivers/" ;
		}
		else if (crudAction == "Delete" && object == "Goods"){
			$("#deleteGood").show();
			url = "showAllGoods/" ;
		}

		
		$.get('http://localhost:8080/'+url).then(function(response)
		{
			var text = "" ;
			var arr = response ;
			for (var i=0 ; i<arr.length() ; i++)
			{
				text += arr[i] + "<br>" ;
			}
			$("#display").html(text);
		});
	});


	$("#addTruck>input[type='submit']").click(function(){
		$.get('http://localhost:8080/addTruck/'+$('#addTruck>input[name="truckID"]').val()).then(function(response)
		{
			if (response == true)
				alert("Truck Added Successfully") ;
			else
				alert("Error, Please Try again!");
		});
	});

	$("#deleteTruck>input[type='submit']").click(function(){
		$.get('http://localhost:8080/deleteTruck/'+$('#deleteTruck>input[name="truckID"]').val()).then(function(response)
		{
			if (response == true)
				alert("Truck Deleted Successfully") ;
			else
				alert("Error, Please Try again!");
		});
	});

	$("#addDriver>input[type='submit']").click(function(){
		$.get('http://localhost:8080/addDriver/'+$('#addDriver>input[name="driverID"]').val()+"/" +
			  $('#addDriver>input[name="driverName"]').val()+"/" + $('#addDriver>input[name="driverPassword"]').val()).then(function(response)
		{
			if (response == true)
				alert("Driver Added Successfully") ;
			else
				alert("Error, Please Try again!");
		});
	});

	$("#deleteDriver>input[type='submit']").click(function(){
		$.get('http://localhost:8080/deleteDriver/'+$('#deleteDriver>input[name="driverID"]').val()).then(function(response)
		{
			if (response == true)
				alert("Driver Deleted Successfully") ;
			else
				alert("Error, Please Try again!");
		});
	});

	$("#addGood>input[type='submit']").click(function(){
		$.get('http://localhost:8080/addGood/'+$('#addGood>input[name="barcode"]').val()+"/" +
			  $('#addGood>input[name="goodName"]').val()+"/" + $('#addGood>input[name="company"]').val()+
			  $('#addGood>input[name="date"]').val()+"/" + $('#addGood>input[name="numGoods"]').val()).then(function(response)
		{
			if (response == true)
				alert("Good Added Successfully") ;
			else
				alert("Error, Please Try again!");
		});
	});

	$("#deleteGood>input[type='submit']").click(function(){
		$.get('http://localhost:8080/deleteGood/'+$('#deleteGood>input[name="goodName"]').val()).then(function(response)
		{
			if (response == true)
				alert("Good Deleted Successfully") ;
			else
				alert("Error, Please Try again!");
		});
	});
});