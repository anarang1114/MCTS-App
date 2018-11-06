var proxy = 'https://cors-anywhere.herokuapp.com/';
$ (setup);
startlat=0;
startlng=0; 
endlat= 0;
endlng=0;
startaddressdefined = false;

function setup(){
	$("#getlocation").click(findmylocation);
	$('#ShowMilwaukeeMap').click(setmilwuakeemap);
	$('#getbestroute').click(findbestroute);
	$('#RemoveAddress').click(clearaddressstartend);
	
}
	

function findmylocation(){
	
	
	
var geolocationMap = L.map('map', {
    layers: MQ.mapLayer(),
    center: [43.038902, -87.906471],
    zoom: 15
}).on('click', function(e) {
    popup.setLatLng(e.latlng).openOn(this);
	
  geocode.reverse(e.latlng);

geocode.reverse(e.latlng);

var latlnglength = (e.latlng).toString().length;
  
  endlat = (e.latlng).toString().substring(7,latlnglength-1).split(",",1);
  
  endlng = e.latlng.toString().substring(endlat.toString().length+9, latlnglength-1);
  
});
  	geocode = MQ.geocode().on('success', function(e) {
  popup.setContent(geocode.describeLocation(e.result.best));
});

if (navigator.geolocation) {
	
    navigator.geolocation.getCurrentPosition(function (position) {
        var latLng = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
			
        };
		startlat = position.coords.latitude;
		startlng = position.coords.longitude;
		
        popup.setLatLng(latLng);
        popup.setContent("This is your location");
		
        popup.openOn(geolocationMap);
		
        geolocationMap.setView(latLng);
		startaddressdefined = true;
    }, function () {
        geolocationErrorOccurred(true, popup, geolocationMap.getCenter());
    });

} else {
    //No browser support geolocation service
    geolocationErrorOccurred(false, popup, geolocationMap.getCenter());
}

function geolocationErrorOccurred(geolocationSupported, popup, latLng) {
    popup.setLatLng(latLng);
    popup.setContent(geolocationSupported ?
            '<b>Error:</b> The Geolocation service failed.' :
            '<b>Error:</b> This browser doesn\'t support geolocation.');
    popup.openOn(geolocationMap);
}

}
function setmilwuakeemap(){

var popup = L.popup(),
  geocode,
  map;

map = L.map('map', {
  layers: MQ.mapLayer(),
  center: [ 43.038902, -87.906471 ],
  zoom: 14 })
  .on('click', function(e) {
    popup.setLatLng(e.latlng).openOn(this);
	
  geocode.reverse(e.latlng);
 
  if(!startaddressdefined){
  var latlnglength = (e.latlng).toString().length;
  
  startlat = (e.latlng).toString().substring(7,latlnglength-1).split(",",1);
  
  startlng = e.latlng.toString().substring(startlat.toString().length+9, latlnglength-1);
  startaddressdefined=true;
  }
  else{
	  var latlnglength = (e.latlng).toString().length;
  
  endlat = (e.latlng).toString().substring(7,latlnglength-1).split(",",1);
  
  endlng = e.latlng.toString().substring(endlat.toString().length+9, latlnglength-1);
  //alert("Start latlng"+ startlat + " "+startlng+ "and End latlng" + endlat + " "+ endlng);
  }
  
});

geocode = MQ.geocode().on('success', function(e) {
  popup.setContent(geocode.describeLocation(e.result.best));
});


}
function clearaddressstartend(){
	var mymap = document.getElementById("map");
	mymap.parentNode.removeChild(mymap);
	mymap.remove();
	startlat =0;
	startlng = 0;
	endlat = 0;
	endlng =0;
	startaddressdefined = false;
}



function findbestroute(){
	if(!startlat || !startlng || !endlat || !endlng){
		alert("error");
	}
	//L.marker([43.175789945929,-87.919274999999]).addTo(map)
	/*
	var map = L.map('map', {
                layers: MQ.mapLayer()
            });
	 L.marker([ startlat, startlng])
    .addTo(map)
    .bindPopup('yo')
    .openPopup()
	*/

}

