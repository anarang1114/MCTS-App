var proxy = 'https://cors-anywhere.herokuapp.com/';
$ (setup);
startlat=0;
startlng=0;
endlat= 0;
endlng=0;
startaddressdefined = false;

$(document).ready(function(){
	$('#Flipinstructions').click(function(){
						$('#instructions').slideToggle('slow');
						 });

});



function setup(){
	
	$("#getlocation").click(findmylocation);
	$('#ShowMilwaukeeMap').click(setmilwuakeemap);
	$('#getbestroute').click(findbestroute);
	$('#RemoveAddress').click(clearaddressstartend);
	$('#instructions').hide();




}


function findmylocation(){

	$("<div/>").attr('id','map').appendTo('body');
	var popup = L.popup(),
	geocode,
	map;

var geolocationMap = L.map('map', {
    layers: MQ.mapLayer(),
    center: [43.038902, -87.906471],
    zoom: 15
}).on('click', function(e) {
    popup.setLatLng(e.latlng).openOn(this);

  geocode.reverse(e.latlng);

geocode.reverse(e.latlng);

var latlnglength = (e.latlng).toString().length;

  endlat = Number((e.latlng).toString().substring(7,latlnglength-1).split(",",1));

  endlng = Number(e.latlng.toString().substring(endlat.toString().length+9, latlnglength-1));

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
$("<div/>").attr('id','map').appendTo('body');
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

  startlat = Number((e.latlng).toString().substring(7,latlnglength-1).split(",",1));

  startlng = Number(e.latlng.toString().substring(startlat.toString().length+9, latlnglength-1));
  startaddressdefined=true;
  }
  else{
	  var latlnglength = (e.latlng).toString().length;

  endlat = Number((e.latlng).toString().substring(7,latlnglength-1).split(",",1));

  endlng = Number(e.latlng.toString().substring(endlat.toString().length+9, latlnglength-1));
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
	document.getElementById("results").innerHTML = "";
}



function findbestroute(){
	if(!startlat || !startlng || !endlat || !endlng){
		alert("No start location and end location selected");
	}
	else{

	var mymap = document.getElementById("map");
	mymap.parentNode.removeChild(mymap);
	mymap.remove();
	$("<div/>").attr('id','map').appendTo('body');
	var map,
dir;

map = L.map('map', {
    layers: MQ.mapLayer(),
    center: [ startlat, startlng],
    zoom: 9
});

dir = MQ.routing.directions()
    .on('success', function(data) {
        var legs = data.route.legs,
            html = '',
            maneuvers,
			finalhtml = '',
            i;

        if (legs && legs.length) {
            maneuvers = legs[0].maneuvers;

            for (i=0; i < maneuvers.length; i++) {

				finalhtml +='<br>'+(i+1) +'. ' +maneuvers[i].narrative+'</br>';
            }
				L.DomUtil.get('results').innerHTML = finalhtml;

        }
    });

dir.optimizedRoute({
    locations: [
        { latLng: { lat: startlat, lng: startlng }},
        { latLng: { lat: endlat, lng: endlng }}
    ]
});

map.addLayer(MQ.routing.routeLayer({
    directions: dir,
    fitBounds: true
}));
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
