$("document").ready(function(){

    map = initMap();

    google.maps.event.addListener(map,'click',function(event) {                
        var lat = event.latLng.lat();
        var lng =  event.latLng.lng();
        
    });

});