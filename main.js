
$ (setup);
startlat=0;
startlng=0;
endlat= 0;
endlng=0;
startaddressdefined = false;
endaddressdefined=false;
startend = new Array();
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
	compileRoutes();
}



function findmylocation(){
	$("#startlocation").html("Start Location: Your location");
	$("#startlocation").css("border-radius", "8px");
	$("#startlocation").css("backgroundColor","green");
	$("#startlocation").css("color","white");
	$("#startlocation").css("font-size","18px");
	
	$("<div/>").attr('id','map').appendTo('body');
	var popup = L.popup(),geocode,map;

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
  $("#endlocation").html("End Location: "+(geocode.describeLocation(e.result.best)));
  $("#endlocation").css("border-radius", "8px");
	$("#endlocation").css("backgroundColor","red");
	$("#endlocation").css("color","white");
	$("#endlocation").css("font-size","18px");
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
  
	}


	});

geocode = MQ.geocode().on('success', function(e) {
  popup.setContent(geocode.describeLocation(e.result.best));
	startend.push(geocode.describeLocation(e.result.best));
	placeaddress();
});

}
function placeaddress(){
	if(!endaddressdefined){
	$("#startlocation").html("Start Location: "+ startend.pop());
	$("#startlocation").css("border-radius", "8px");
	$("#startlocation").css("backgroundColor","green");
	$("#startlocation").css("color","white");
	$("#startlocation").css("font-size","18px");
	endaddressdefined=true;
	}
	else{
		$("#endlocation").html("End Location: "+ startend.pop());
		$("#endlocation").css("border-radius", "8px");
		$("#endlocation").css("backgroundColor","red");
		$("#endlocation").css("color","white");
		$("#endlocation").css("font-size","18px");
		
	}
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
	$("#startlocation").html("");
	$("#endlocation").html("");
	$("#results").css("border-radius", "0px");
	$("#results").css("border","0px solid green");
	endaddressdefined=false;
	
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
$("#results").css("border-radius", "16px");
$("#results").css("border","3px solid green");
}


//ROUTE INFORMATION

var proxy = 'https://cors-anywhere.herokuapp.com/';
var allStops = [];

function compileRoutes(){
	bluNorth();
	bluSouth();
	golEast();
	golWest();
	greNorth();
	greSouth();
	purNorth();
	purSouth();
	redEast();
	redWest();
}

function receiveBluNorth(result){
	var stops = result["bustime-response"].stops;
	var myStop = "blu:north:"; 
	for(i in stops){
		myStop += result["bustime-response"].stops[i].stpid + ":";
		myStop += result["bustime-response"].stops[i].stpnm + ":";
		myStop += result["bustime-response"].stops[i].lat + ":";
		myStop += result["bustime-response"].stops[i].lon + ":";
		allStops.push(myStop);
		myStop = "blu:north:";
	}
	
}
function receiveBluSouth(result){
	var stops = result["bustime-response"].stops;
	var myStop = "blu:south:"; 
	for(i in stops){
		myStop += result["bustime-response"].stops[i].stpid + ":";
		myStop += result["bustime-response"].stops[i].stpnm + ":";
		myStop += result["bustime-response"].stops[i].lat + ":";
		myStop += result["bustime-response"].stops[i].lon + ":";
		allStops.push(myStop);
		myStop = "blu:south:";
	}
}

function receiveGolEast(result){
	var stops = result["bustime-response"].stops;
	var myStop = "gol:east:"; 
	for(i in stops){
		myStop += result["bustime-response"].stops[i].stpid + ":";
		myStop += result["bustime-response"].stops[i].stpnm + ":";
		myStop += result["bustime-response"].stops[i].lat + ":";
		myStop += result["bustime-response"].stops[i].lon + ":";
		allStops.push(myStop);
		myStop = "gol:east:";
	}
}
function receiveGolWest(result){
	var stops = result["bustime-response"].stops;
	var myStop = "gol:west:"; 
	for(i in stops){
		myStop += result["bustime-response"].stops[i].stpid + ":";
		myStop += result["bustime-response"].stops[i].stpnm + ":";
		myStop += result["bustime-response"].stops[i].lat + ":";
		myStop += result["bustime-response"].stops[i].lon + ":";
		allStops.push(myStop);
		myStop = "gol:west:";
	}
}

function receiveGreNorth(result){
	var stops = result["bustime-response"].stops;
	var myStop = "gre:north:"; 
	for(i in stops){
		myStop += result["bustime-response"].stops[i].stpid + ":";
		myStop += result["bustime-response"].stops[i].stpnm + ":";
		myStop += result["bustime-response"].stops[i].lat + ":";
		myStop += result["bustime-response"].stops[i].lon + ":";
		allStops.push(myStop);
		myStop = "gre:north:";
	}
}

function receiveGreSouth(result){
	var stops = result["bustime-response"].stops;
	var myStop = "gre:south:"; 
	for(i in stops){
		myStop += result["bustime-response"].stops[i].stpid + ":";
		myStop += result["bustime-response"].stops[i].stpnm + ":";
		myStop += result["bustime-response"].stops[i].lat + ":";
		myStop += result["bustime-response"].stops[i].lon + ":";
		allStops.push(myStop);
		myStop = "gre:south:";
	}
}
function receivePurNorth(result){
	var stops = result["bustime-response"].stops;
	var myStop = "pur:north:"; 
	for(i in stops){
		myStop += result["bustime-response"].stops[i].stpid + ":";
		myStop += result["bustime-response"].stops[i].stpnm + ":";
		myStop += result["bustime-response"].stops[i].lat + ":";
		myStop += result["bustime-response"].stops[i].lon + ":";
		allStops.push(myStop);
		myStop = "pur:north:";
	}
}
function receivePurSouth(result){
	var stops = result["bustime-response"].stops;
	var myStop = "pur:south:"; 
	for(i in stops){
		myStop += result["bustime-response"].stops[i].stpid + ":";
		myStop += result["bustime-response"].stops[i].stpnm + ":";
		myStop += result["bustime-response"].stops[i].lat + ":";
		myStop += result["bustime-response"].stops[i].lon + ":";
		allStops.push(myStop);
		myStop = "pur:south:";
	}	
}
function receiveRedEast(result){
	var stops = result["bustime-response"].stops;
	var myStop = "red:east:"; 
	for(i in stops){
		myStop += result["bustime-response"].stops[i].stpid + ":";
		myStop += result["bustime-response"].stops[i].stpnm + ":";
		myStop += result["bustime-response"].stops[i].lat + ":";
		myStop += result["bustime-response"].stops[i].lon + ":";
		allStops.push(myStop);
		myStop = "red:east:";
	}	
}
function receiveRedWest(result){
	var stops = result["bustime-response"].stops;
	var myStop = "red:west:"; 
	for(i in stops){
		myStop += result["bustime-response"].stops[i].stpid + ":";
		myStop += result["bustime-response"].stops[i].stpnm + ":";
		myStop += result["bustime-response"].stops[i].lat + ":";
		myStop += result["bustime-response"].stops[i].lon + ":";
		allStops.push(myStop);
		myStop = "red:west:";
	}	
}

//Get Blue Lines
function bluNorth(){
	var url = proxy + "http://realtime.ridemcts.com/bustime/api/v3/getstops?key=uSb3vFN6m4gKwnXzipg2RmwgM&rt=BLU&dir=NORTH&format=json";
	$.ajax(
  {  
    "url":url,
	"method": "GET",
    "dataType": "json",
	headers:{
		"x-requested-with": "xhr"
	},
	"success": receiveBluNorth,
    "error": function(x){alert("Error!"+JSON.stringify(x));},
  });
}
  
function bluSouth(){
	var url = proxy + "http://realtime.ridemcts.com/bustime/api/v3/getstops?key=uSb3vFN6m4gKwnXzipg2RmwgM&rt=BLU&dir=SOUTH&format=json";
	$.ajax(
  {  
    "url":url,
	"method": "GET",
    "dataType": "json",
	headers:{
		"x-requested-with": "xhr"
	},
	    "success": receiveBluSouth,
    "error": function(x){alert("Error!"+JSON.stringify(x));},
  });
}
 
 //Get Gold Lines
 function golEast(){
	var url = proxy + "http://realtime.ridemcts.com/bustime/api/v3/getstops?key=uSb3vFN6m4gKwnXzipg2RmwgM&rt=GOL&dir=EAST&format=json";
	$.ajax(
  {  
    "url":url,
	"method": "GET",
    "dataType": "json",
	headers:{
		"x-requested-with": "xhr"
	},
	    "success": receiveGolEast,
    "error": function(x){alert("Error!"+JSON.stringify(x));},
  });
}
  
function golWest(){
	var url = proxy + "http://realtime.ridemcts.com/bustime/api/v3/getstops?key=uSb3vFN6m4gKwnXzipg2RmwgM&rt=GOL&dir=WEST&format=json";
	$.ajax(
  {  
    "url":url,
	"method": "GET",
    "dataType": "json",
	headers:{
		"x-requested-with": "xhr"
	},
	    "success": receiveGolWest,
    "error": function(x){alert("Error!"+JSON.stringify(x));},
  });
}
  
 //Get Green Lines
 function greNorth(){
	var url = proxy + "http://realtime.ridemcts.com/bustime/api/v3/getstops?key=uSb3vFN6m4gKwnXzipg2RmwgM&rt=GRE&dir=NORTH&format=json";
	$.ajax(
  {  
    "url":url,
	"method": "GET",
    "dataType": "json",
	headers:{
		"x-requested-with": "xhr"
	},
	    "success": receiveGreNorth,
    "error": function(x){alert("Error!"+JSON.stringify(x));},
  });
}

function greSouth(){
	var url = proxy + "http://realtime.ridemcts.com/bustime/api/v3/getstops?key=uSb3vFN6m4gKwnXzipg2RmwgM&rt=GRE&dir=SOUTH&format=json";
	$.ajax(
  {  
    "url":url,
	"method": "GET",
    "dataType": "json",
	headers:{
		"x-requested-with": "xhr"
	},
	    "success": receiveGreSouth,
    "error": function(x){alert("Error!"+JSON.stringify(x));},
  });
}  
//GET PURPLE LINES
function purNorth(){
	var url = proxy + "http://realtime.ridemcts.com/bustime/api/v3/getstops?key=uSb3vFN6m4gKwnXzipg2RmwgM&rt=PUR&dir=NORTH&format=json";
	$.ajax(
  {  
    "url":url,
	"method": "GET",
    "dataType": "json",
	headers:{
		"x-requested-with": "xhr"
	},
	    "success": receivePurNorth,
    "error": function(x){alert("Error!"+JSON.stringify(x));},
  });
}
function purSouth(){
	var url = proxy + "http://realtime.ridemcts.com/bustime/api/v3/getstops?key=uSb3vFN6m4gKwnXzipg2RmwgM&rt=PUR&dir=SOUTH&format=json";
	$.ajax(
  {  
    "url":url,
	"method": "GET",
    "dataType": "json",
	headers:{
		"x-requested-with": "xhr"
	},
	    "success": receivePurSouth,
    "error": function(x){alert("Error!"+JSON.stringify(x));},
  });
} 
 //GET RED LINES
  function redEast(){
	var url = proxy + "http://realtime.ridemcts.com/bustime/api/v3/getstops?key=uSb3vFN6m4gKwnXzipg2RmwgM&rt=RED&dir=EAST&format=json";
	$.ajax(
  {  
    "url":url,
	"method": "GET",
    "dataType": "json",
	headers:{
		"x-requested-with": "xhr"
	},
	    "success": receiveRedEast,
    "error": function(x){alert("Error!"+JSON.stringify(x));},
  });
}
function redWest(){
	var url = proxy + "http://realtime.ridemcts.com/bustime/api/v3/getstops?key=uSb3vFN6m4gKwnXzipg2RmwgM&rt=RED&dir=WEST&format=json";
	$.ajax(
  {  
    "url":url,
	"method": "GET",
    "dataType": "json",
	headers:{
		"x-requested-with": "xhr"
	},
	    "success": receiveRedWest,
    "error": function(x){alert("Error!"+JSON.stringify(x));},
  });
}