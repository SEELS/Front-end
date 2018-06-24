var app = angular.module("trucksController",[]);

app.controller("trucksController",function($scope,$http , $q  ){

		var domain = "https://seelsapp.herokuapp.com/";
		var done = false; 
		var truckArr = [];
		var location ;
		
		function addToArr(truck , len)
		{
			truckArr.push(truck);
			
			if (truckArr.length === len)
			{
				showActiveTrucks(truckArr);
			}
			
		}
		
		function getLocation(t , callback , len)
		{
		   	return $http.get(domain+'viewCurrentTruckLocation/' + t.id).then(function(response) {
		   		console.log(response);
				t.longitude = response.data.Success.lon;
				t.latitude = response.data.Success.lat;
				callback(t , len);
				return response.data;
			});
		}
		
		$scope.getActiveTrucks = function()
		{
			showActiveTrucks([]);
			$http.get(domain+"getActiveTrucks")
			
			.then(function(response) {
				$scope.trucks = response.data;

				for (var i = 0 ; i<$scope.trucks.length ; i++)
				{
					location = getLocation($scope.trucks[i] , addToArr ,$scope.trucks.length );
				}
			});
		}
		
		$scope.getTruckData = function(truckId)
		{
			$http.get(domain+"viewTruck/"+truckId)
			
			.then(function(response) {
			
			$scope.selectedTruck = response.data.Success;
			showSpecificTruck($scope.selectedTruck.id);
			});
		}
	
	
});
		