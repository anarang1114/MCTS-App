$ (setup);
startlat=0;
startlng=0;
endlat= 0;
endlng=0;
busroutedistance = new Array();
startaddressdefined = false;
endaddressdefined=false;
startend = new Array();
allStops = new Array();
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
	//compileRoutes();
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
	finder();
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
function finder(){
	
	busroutedistance.push(["BLU"],[distanceblu()]);
	busroutedistance.push(["GOL"],[distancegol()]);
	busroutedistance.push(["GRE"],[distancegre()]);
	busroutedistance.push(["RED"],[distancered()]);
	busroutedistance.push(["RR1"],[distancerr1()]);
	busroutedistance.push(["RR2"],[distancerr2()]);
	busroutedistance.push(["RR3"],[distancerr3()]);
	busroutedistance.push(["6"],[distance6()]);
	busroutedistance.push(["12"],[distance12()]);
	busroutedistance.push(["14"],[distance14()]);
	//alert(busroutedistance[0]);
	console.log(busroutedistance);
	
}
function distanceblu(){
	
    
    var pointstart = turf.point([startlat, startlng]);
	var pointend = turf.point([endlat,endlng]);
	var line = turf.lineString([[43.138507947467, -88.045287000002],[43.038841951639, -87.921516999999]]);
	var fromstart = turf.pointToLineDistance(pointstart, line, {units: 'miles'});
	var fromend = turf.pointToLineDistance(pointend, line, {units:'miles'});
	
	var distance=fromstart+fromend;

return distance;
}
function distancegre(){
	
    
    var pointstart = turf.point([startlat, startlng]);
	var pointend = turf.point([endlat,endlng]);
	var line = turf.lineString([[43.017001952562, -87.911104999999],[43.038347951659,-87.908912]]);
	var fromstart = turf.pointToLineDistance(pointstart, line, {units: 'miles'});
	var fromend = turf.pointToLineDistance(pointend, line, {units:'miles'});
	
	var distance=fromstart+fromend;

return distance;
}
function distancegol(){
	
    
    var pointstart = turf.point([startlat, startlng]);
	var pointend = turf.point([endlat,endlng]);
	var line = turf.lineString([[43.044674951391,-88.02073],[43.038657951647,-87.909292999999]]);
	var fromstart = turf.pointToLineDistance(pointstart, line, {units: 'miles'});
	var fromend = turf.pointToLineDistance(pointend, line, {units:'miles'});
	
	var distance=fromstart+fromend;

return distance;
}
function distancepur(){
	
    
    var pointstart = turf.point([startlat, startlng]);
	var pointend = turf.point([endlat,endlng]);
	var line = turf.lineString([[42.976717954279,-87.948252000001],[43.10433594889,-87.94615]]);
	var fromstart = turf.pointToLineDistance(pointstart, line, {units: 'miles'});
	var fromend = turf.pointToLineDistance(pointend, line, {units:'miles'});
	
	var distance=fromstart+fromend;

return distance;}
function distancered(){
	
    
    var pointstart = turf.point([startlat, startlng]);
	var pointend = turf.point([endlat,endlng]);
	var line = turf.lineString([[43.087152949606,-88.070225000002],[43.079069949945,-87.882732999999]]);
	var fromstart = turf.pointToLineDistance(pointstart, line, {units: 'miles'});
	var fromend = turf.pointToLineDistance(pointend, line, {units:'miles'});
	
	var distance=fromstart+fromend;

return distance;}
function distancerr1(){
	
    
    var pointstart = turf.point([startlat, startlng]);
	var pointend = turf.point([endlat,endlng]);
var line = turf.lineString([[43.010142952853,-87.925522000001],[42.997427953394,-87.936521999999]]);
	var fromstart = turf.pointToLineDistance(pointstart, line, {units: 'miles'});
	var fromend = turf.pointToLineDistance(pointend, line, {units:'miles'});
	
	var distance=fromstart+fromend;

return distance;}
function distancerr2(){
	
    
    var pointstart = turf.point([startlat, startlng]);
	var pointend = turf.point([endlat,endlng]);
	var line = turf.lineString([[42.970471954546,-87.93881],[42.98860695377,-87.945692]]);
	var fromstart = turf.pointToLineDistance(pointstart, line, {units: 'miles'});
	var fromend = turf.pointToLineDistance(pointend, line, {units:'miles'});
	
	var distance=fromstart+fromend;

return distance;}
function distancerr3(){
	
    
    var pointstart = turf.point([startlat, startlng]);
	var pointend = turf.point([endlat,endlng]);
	var line = turf.lineString([[43.010142952853,-87.925522000001],[43.038841951639, -87.921516999999]]);
	var fromstart = turf.pointToLineDistance(pointstart, line, {units: 'miles'});
	var fromend = turf.pointToLineDistance(pointend, line, {units:'miles'});
	
	var distance=fromstart+fromend;

return distance;}
function distance6(){
	
    
    var pointstart = turf.point([startlat, startlng]);
	var pointend = turf.point([endlat,endlng]);
	var line = turf.lineString([[42.993192953574,-88.119371999998],[42.991022953668,-88.109565000001]]);
	var fromstart = turf.pointToLineDistance(pointstart, line, {units: 'miles'});
	var fromend = turf.pointToLineDistance(pointend, line, {units:'miles'});
	
	var distance=fromstart+fromend;

return distance;}
function distance12(){
	
    
    var pointstart = turf.point([startlat, startlng]);
	var pointend = turf.point([endlat,endlng]);
	var line = turf.lineString([[43.050039951167, -87.927143],[43.03880995164,-87.920547000002]]);
	var fromstart = turf.pointToLineDistance(pointstart, line, {units: 'miles'});
	var fromend = turf.pointToLineDistance(pointend, line, {units:'miles'});
	
	var distance=fromstart+fromend;

return distance;}
function distance14(){
	
    
    var pointstart = turf.point([startlat, startlng]);
	var pointend = turf.point([endlat,endlng]);
	var line = turf.lineString([[43.030639951985, -87.933088000001],[43.038746951641,-87.908928000001]]);
	var fromstart = turf.pointToLineDistance(pointstart, line, {units: 'miles'});
	var fromend = turf.pointToLineDistance(pointend, line, {units:'miles'});
	
	var distance=fromstart+fromend;

return distance;
}
function distance15(){
	
    
    var pointstart = turf.point([startlat, startlng]);
	var pointend = turf.point([endlat,endlng]);
	var line = turf.lineString([[43.030639951985, -87.933088000001],[43.038746951641,-87.908928000001]]);
	var fromstart = turf.pointToLineDistance(pointstart, line, {units: 'miles'});
	var fromend = turf.pointToLineDistance(pointend, line, {units:'miles'});
	
	var distance=fromstart+fromend;


return distance;
//ROUTE INFORMATION

}

var blueNorthStops = [];
var blueSouthStops = [];
var golEastStops = [];
var golWestStops = [];
var greNorthStops = [];
var greSouthStops = [];
var purNorthStops = [];
var purSouthStops = [];
var redEastStops = [];
var redWestStops = [];

function getLineName(line){
	var temp = line.split();
	return temp[0];
}

function getStopDirection(line){
		var temp = line.split();
	return temp[1];
}
function getStopId(line){
	var temp = line.split();
	return temp[2];
}
function getStopName(line){
	var temp = line.split();
	return temp[3];
}
function getStopLat(line){
	var temp = line.split();
	return temp[4];
}
function getStopLon(line){
	var temp = line.split();
	return temp[5];
}

function populateStops(color){
	var thisLineColor = color[0];
	var stopsNE = [];
	var stopsSW = [];
	switch(thisLine){
		case "BLU":
			bluNorth();
			bluSouth();
			stopsNE = bluNorthStops;
			stopsSW = bluSouthStops;

		case "GOL":
			golNorth();
			golSouth();
			stopsNE = golEastStops;
			stopsSW = golWestStops;
		
		case "GRE":
			greNorth();
			greSouth();
			stopsNE = greNorthStops;
			stopsSW = greSouthStops;
		
		case "PUR":
			purNorth();
			purSouth();
			stopsNE = purNorth();
			stopsSW = purSouth();
			
		case "RED":
			redEast();
			redWest();
			stopsNE = redEast();
			stopsSW = redWest();
		
		case 
	}
}


function receiveBluNorth(result){
	var stops = result["bustime-response"].stops;
	var myStop = "BLU:NORTH:"; 
	for(i in stops){
		myStop += result["bustime-response"].stops[i].stpid + ":";
		myStop += result["bustime-response"].stops[i].stpnm + ":";
		myStop += result["bustime-response"].stops[i].lat + ":";
		myStop += result["bustime-response"].stops[i].lon + ":";
		bluNorth.push(myStop);
		myStop = "BLU:NORTH:";
	}
	
}
function receiveBluSouth(result){
	var stops = result["bustime-response"].stops;
	var myStop = "BLU:SOUTH:"; 
	for(i in stops){
		myStop += result["bustime-response"].stops[i].stpid + ":";
		myStop += result["bustime-response"].stops[i].stpnm + ":";
		myStop += result["bustime-response"].stops[i].lat + ":";
		myStop += result["bustime-response"].stops[i].lon + ":";
		bluSouth.push(myStop);
		myStop = "BLU:SOUTH:";
	}
}

function receiveGolEast(result){
	var stops = result["bustime-response"].stops;
	var myStop = "GOL:EAST:"; 
	for(i in stops){
		myStop += result["bustime-response"].stops[i].stpid + ":";
		myStop += result["bustime-response"].stops[i].stpnm + ":";
		myStop += result["bustime-response"].stops[i].lat + ":";
		myStop += result["bustime-response"].stops[i].lon + ":";
		golEast.push(myStop);
		myStop = "GOL:EAST:";
	}
}
function receiveGolWest(result){
	var stops = result["bustime-response"].stops;
	var myStop = "GOL:WEST:"; 
	for(i in stops){
		myStop += result["bustime-response"].stops[i].stpid + ":";
		myStop += result["bustime-response"].stops[i].stpnm + ":";
		myStop += result["bustime-response"].stops[i].lat + ":";
		myStop += result["bustime-response"].stops[i].lon + ":";
		golWest.push(myStop);
		myStop = "GOL:WEST:";
	}
}

function receiveGreNorth(result){
	var stops = result["bustime-response"].stops;
	var myStop = "GRE:NORTH:"; 
	for(i in stops){
		myStop += result["bustime-response"].stops[i].stpid + ":";
		myStop += result["bustime-response"].stops[i].stpnm + ":";
		myStop += result["bustime-response"].stops[i].lat + ":";
		myStop += result["bustime-response"].stops[i].lon + ":";
		greNorth.push(myStop);
		myStop = "GRE:NORTH:";
	}
}

function receiveGreSouth(result){
	var stops = result["bustime-response"].stops;
	var myStop = "GRE:SOUTH:"; 
	for(i in stops){
		myStop += result["bustime-response"].stops[i].stpid + ":";
		myStop += result["bustime-response"].stops[i].stpnm + ":";
		myStop += result["bustime-response"].stops[i].lat + ":";
		myStop += result["bustime-response"].stops[i].lon + ":";
		greSouth.push(myStop);
		myStop = "GRE:SOUTH:";
	}
}
function receivePurNorth(result){
	var stops = result["bustime-response"].stops;
	var myStop = "PUR:NORTH:"; 
	for(i in stops){
		myStop += result["bustime-response"].stops[i].stpid + ":";
		myStop += result["bustime-response"].stops[i].stpnm + ":";
		myStop += result["bustime-response"].stops[i].lat + ":";
		myStop += result["bustime-response"].stops[i].lon + ":";
		purNorth.push(myStop);
		myStop = "PUR:NORTH:";
	}
}
function receivePurSouth(result){
	var stops = result["bustime-response"].stops;
	var myStop = "PUR:SOUTH:"; 
	for(i in stops){
		myStop += result["bustime-response"].stops[i].stpid + ":";
		myStop += result["bustime-response"].stops[i].stpnm + ":";
		myStop += result["bustime-response"].stops[i].lat + ":";
		myStop += result["bustime-response"].stops[i].lon + ":";
		purSouth.push(myStop);
		myStop = "PUR:SOUTH:";
	}	
}
function receiveRedEast(result){
	var stops = result["bustime-response"].stops;
	var myStop = "RED:EAST:"; 
	for(i in stops){
		myStop += result["bustime-response"].stops[i].stpid + ":";
		myStop += result["bustime-response"].stops[i].stpnm + ":";
		myStop += result["bustime-response"].stops[i].lat + ":";
		myStop += result["bustime-response"].stops[i].lon + ":";
		redEast.push(myStop);
		myStop = "RED:EAST:";
	}	
}
function receiveRedWest(result){
	var stops = result["bustime-response"].stops;
	var myStop = "RED:WEST:"; 
	for(i in stops){
		myStop += result["bustime-response"].stops[i].stpid + ":";
		myStop += result["bustime-response"].stops[i].stpnm + ":";
		myStop += result["bustime-response"].stops[i].lat + ":";
		myStop += result["bustime-response"].stops[i].lon + ":";
		redWest.push(myStop);
		myStop = "RED:WEST:";
	}	
}
function receiveRR1North(result){
	var stops = result["bustime-response"].stops;
	var myStop = "RR1:NORTH:"; 
	for(i in stops){
		myStop += result["bustime-response"].stops[i].stpid + ":";
		myStop += result["bustime-response"].stops[i].stpnm + ":";
		myStop += result["bustime-response"].stops[i].lat + ":";
		myStop += result["bustime-response"].stops[i].lon + ":";
		allStops.push(myStop);
		myStop = "RR1:NORTH:";
	}	
}
function receiveRR1South(result){
	var stops = result["bustime-response"].stops;
	var myStop = "RR1:SOUTH:"; 
	for(i in stops){
		myStop += result["bustime-response"].stops[i].stpid + ":";
		myStop += result["bustime-response"].stops[i].stpnm + ":";
		myStop += result["bustime-response"].stops[i].lat + ":";
		myStop += result["bustime-response"].stops[i].lon + ":";
		allStops.push(myStop);
		myStop = "RR1:SOUTH:";
	}	
}
function receiveRR2North(result){
	var stops = result["bustime-response"].stops;
	var myStop = "RR2:north:"; 
	for(i in stops){
		myStop += result["bustime-response"].stops[i].stpid + ":";
		myStop += result["bustime-response"].stops[i].stpnm + ":";
		myStop += result["bustime-response"].stops[i].lat + ":";
		myStop += result["bustime-response"].stops[i].lon + ":";
		allStops.push(myStop);
		myStop = "RR2:north:";
	}	
}
function receiveRR2South(result){
	var stops = result["bustime-response"].stops;
	var myStop = "RR2:SOUTH:"; 
	for(i in stops){
		myStop += result["bustime-response"].stops[i].stpid + ":";
		myStop += result["bustime-response"].stops[i].stpnm + ":";
		myStop += result["bustime-response"].stops[i].lat + ":";
		myStop += result["bustime-response"].stops[i].lon + ":";
		allStops.push(myStop);
		myStop = "RR2:SOUTH:";
	}	
}function receiveRR3North(result){
	var stops = result["bustime-response"].stops;
	var myStop = "RR3:NORTH:"; 
	for(i in stops){
		myStop += result["bustime-response"].stops[i].stpid + ":";
		myStop += result["bustime-response"].stops[i].stpnm + ":";
		myStop += result["bustime-response"].stops[i].lat + ":";
		myStop += result["bustime-response"].stops[i].lon + ":";
		allStops.push(myStop);
		myStop = "RR3:NORTH:";
	}	
}
function receiveRR3South(result){
	var stops = result["bustime-response"].stops;
	var myStop = "RR3:SOUTH:"; 
	for(i in stops){
		myStop += result["bustime-response"].stops[i].stpid + ":";
		myStop += result["bustime-response"].stops[i].stpnm + ":";
		myStop += result["bustime-response"].stops[i].lat + ":";
		myStop += result["bustime-response"].stops[i].lon + ":";
		allStops.push(myStop);
		myStop = "RR3:SOUTH:";
	}	
}
function receive6East(result){
	var stops = result["bustime-response"].stops;
	var myStop = "6:EAST:"; 
	for(i in stops){
		myStop += result["bustime-response"].stops[i].stpid + ":";
		myStop += result["bustime-response"].stops[i].stpnm + ":";
		myStop += result["bustime-response"].stops[i].lat + ":";
		myStop += result["bustime-response"].stops[i].lon + ":";
		allStops.push(myStop);
		myStop = "6:EAST:";
	}	
}
function receive6West(result){
	var stops = result["bustime-response"].stops;
	var myStop = "6:WEST:"; 
	for(i in stops){
		myStop += result["bustime-response"].stops[i].stpid + ":";
		myStop += result["bustime-response"].stops[i].stpnm + ":";
		myStop += result["bustime-response"].stops[i].lat + ":";
		myStop += result["bustime-response"].stops[i].lon + ":";
		allStops.push(myStop);
		myStop = "6:WEST:";
	}	
}
function receive12East(result){
	var stops = result["bustime-response"].stops;
	var myStop = "12:EAST:"; 
	for(i in stops){
		myStop += result["bustime-response"].stops[i].stpid + ":";
		myStop += result["bustime-response"].stops[i].stpnm + ":";
		myStop += result["bustime-response"].stops[i].lat + ":";
		myStop += result["bustime-response"].stops[i].lon + ":";
		allStops.push(myStop);
		myStop = "12:EAST:";
	}	
}
function receive12West(result){
	var stops = result["bustime-response"].stops;
	var myStop = "12:WEST:"; 
	for(i in stops){
		myStop += result["bustime-response"].stops[i].stpid + ":";
		myStop += result["bustime-response"].stops[i].stpnm + ":";
		myStop += result["bustime-response"].stops[i].lat + ":";
		myStop += result["bustime-response"].stops[i].lon + ":";
		allStops.push(myStop);
		myStop = "12:WEST:";
	}	
}  
function receive14North(result){
	var stops = result["bustime-response"].stops;
	var myStop = "14:NORTH:"; 
	for(i in stops){
		myStop += result["bustime-response"].stops[i].stpid + ":";
		myStop += result["bustime-response"].stops[i].stpnm + ":";
		myStop += result["bustime-response"].stops[i].lat + ":";
		myStop += result["bustime-response"].stops[i].lon + ":";
		allStops.push(myStop);
		myStop = "14:NORTH:";
	}	
}
function receive14South(result){
	var stops = result["bustime-response"].stops;
	var myStop = "14:SOUTH:"; 
	for(i in stops){
		myStop += result["bustime-response"].stops[i].stpid + ":";
		myStop += result["bustime-response"].stops[i].stpnm + ":";
		myStop += result["bustime-response"].stops[i].lat + ":";
		myStop += result["bustime-response"].stops[i].lon + ":";
		allStops.push(myStop);
		myStop = "14:SOUTH:";
	}	
}

function receive15North(result){
	var stops = result["bustime-response"].stops;
	var myStop = "15:NORTH:"; 
	for(i in stops){
		myStop += result["bustime-response"].stops[i].stpid + ":";
		myStop += result["bustime-response"].stops[i].stpnm + ":";
		myStop += result["bustime-response"].stops[i].lat + ":";
		myStop += result["bustime-response"].stops[i].lon + ":";
		allStops.push(myStop);
		myStop = "15:NORTH:";
	}	
}
function receive15South(result){
	var stops = result["bustime-response"].stops;
	var myStop = "15:SOUTH:"; 
	for(i in stops){
		myStop += result["bustime-response"].stops[i].stpid + ":";
		myStop += result["bustime-response"].stops[i].stpnm + ":";
		myStop += result["bustime-response"].stops[i].lat + ":";
		myStop += result["bustime-response"].stops[i].lon + ":";
		allStops.push(myStop);
		myStop = "15:SOUTH:";
	}	
}

function receive17East(result){
		var stops = result["bustime-response"].stops;
	var myStop = "17:EAST:"; 
	for(i in stops){
		myStop += result["bustime-response"].stops[i].stpid + ":";
		myStop += result["bustime-response"].stops[i].stpnm + ":";
		myStop += result["bustime-response"].stops[i].lat + ":";
		myStop += result["bustime-response"].stops[i].lon + ":";
		allStops.push(myStop);
		myStop = "17:EAST:";
	}	
}

function receive17West(result){
		var stops = result["bustime-response"].stops;
	var myStop = "17:WEST:"; 
	for(i in stops){
		myStop += result["bustime-response"].stops[i].stpid + ":";
		myStop += result["bustime-response"].stops[i].stpnm + ":";
		myStop += result["bustime-response"].stops[i].lat + ":";
		myStop += result["bustime-response"].stops[i].lon + ":";
		allStops.push(myStop);
		myStop = "17:WEST:";
	}	
}
function receive19North(result){
	var stops = result["bustime-response"].stops;
	var myStop = "19:NORTH:"; 
	for(i in stops){
		myStop += result["bustime-response"].stops[i].stpid + ":";
		myStop += result["bustime-response"].stops[i].stpnm + ":";
		myStop += result["bustime-response"].stops[i].lat + ":";
		myStop += result["bustime-response"].stops[i].lon + ":";
		allStops.push(myStop);
		myStop = "19:NORTH:";
	}	
}
function receive19South(result){
	var stops = result["bustime-response"].stops;
	var myStop = "19:SOUTH:"; 
	for(i in stops){
		myStop += result["bustime-response"].stops[i].stpid + ":";
		myStop += result["bustime-response"].stops[i].stpnm + ":";
		myStop += result["bustime-response"].stops[i].lat + ":";
		myStop += result["bustime-response"].stops[i].lon + ":";
		allStops.push(myStop);
		myStop = "19:SOUTH:";
	}	
}
function receive21East(result){
		var stops = result["bustime-response"].stops;
	var myStop = "21:EAST:"; 
	for(i in stops){
		myStop += result["bustime-response"].stops[i].stpid + ":";
		myStop += result["bustime-response"].stops[i].stpnm + ":";
		myStop += result["bustime-response"].stops[i].lat + ":";
		myStop += result["bustime-response"].stops[i].lon + ":";
		allStops.push(myStop);
		myStop = "21:EAST:";
	}	
}

function receive21West(result){
	var stops = result["bustime-response"].stops;
	var myStop = "21:WEST:"; 
	for(i in stops){
		myStop += result["bustime-response"].stops[i].stpid + ":";
		myStop += result["bustime-response"].stops[i].stpnm + ":";
		myStop += result["bustime-response"].stops[i].lat + ":";
		myStop += result["bustime-response"].stops[i].lon + ":";
		allStops.push(myStop);
		myStop = "21:WEST:";
	}	
}
function receive22East(result){
		var stops = result["bustime-response"].stops;
	var myStop = "22:EAST:"; 
	for(i in stops){
		myStop += result["bustime-response"].stops[i].stpid + ":";
		myStop += result["bustime-response"].stops[i].stpnm + ":";
		myStop += result["bustime-response"].stops[i].lat + ":";
		myStop += result["bustime-response"].stops[i].lon + ":";
		allStops.push(myStop);
		myStop = "21:EAST:";
	}	
}

function receive22West(result){
	var stops = result["bustime-response"].stops;
	var myStop = "22:WEST:"; 
	for(i in stops){
		myStop += result["bustime-response"].stops[i].stpid + ":";
		myStop += result["bustime-response"].stops[i].stpnm + ":";
		myStop += result["bustime-response"].stops[i].lat + ":";
		myStop += result["bustime-response"].stops[i].lon + ":";
		allStops.push(myStop);
		myStop = "22:WEST:";
	}	
}
//Get Blue Lines
function bluNorth(){
	var url = 'https://cors-anywhere.herokuapp.com/'+ "http://realtime.ridemcts.com/bustime/api/v3/getstops?key=uSb3vFN6m4gKwnXzipg2RmwgM&rt=BLU&dir=NORTH&format=json";
	$.ajax(
  {  
    "url": url,
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
	var url = 'https://cors-anywhere.herokuapp.com/' + "http://realtime.ridemcts.com/bustime/api/v3/getstops?key=uSb3vFN6m4gKwnXzipg2RmwgM&rt=BLU&dir=SOUTH&format=json";
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
	var url = 'https://cors-anywhere.herokuapp.com/' + "http://realtime.ridemcts.com/bustime/api/v3/getstops?key=uSb3vFN6m4gKwnXzipg2RmwgM&rt=GOL&dir=EAST&format=json";
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
	var url = 'https://cors-anywhere.herokuapp.com/' + "http://realtime.ridemcts.com/bustime/api/v3/getstops?key=uSb3vFN6m4gKwnXzipg2RmwgM&rt=GOL&dir=WEST&format=json";
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
	var url = 'https://cors-anywhere.herokuapp.com/' + "http://realtime.ridemcts.com/bustime/api/v3/getstops?key=uSb3vFN6m4gKwnXzipg2RmwgM&rt=GRE&dir=NORTH&format=json";
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
	var url = 'https://cors-anywhere.herokuapp.com/' + "http://realtime.ridemcts.com/bustime/api/v3/getstops?key=uSb3vFN6m4gKwnXzipg2RmwgM&rt=GRE&dir=SOUTH&format=json";
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
	var url = 'https://cors-anywhere.herokuapp.com/' + "http://realtime.ridemcts.com/bustime/api/v3/getstops?key=uSb3vFN6m4gKwnXzipg2RmwgM&rt=PUR&dir=NORTH&format=json";
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
	var url = 'https://cors-anywhere.herokuapp.com/' + "http://realtime.ridemcts.com/bustime/api/v3/getstops?key=uSb3vFN6m4gKwnXzipg2RmwgM&rt=PUR&dir=SOUTH&format=json";
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
	var url = 'https://cors-anywhere.herokuapp.com/' + "http://realtime.ridemcts.com/bustime/api/v3/getstops?key=uSb3vFN6m4gKwnXzipg2RmwgM&rt=RED&dir=EAST&format=json";
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
	var url = 'https://cors-anywhere.herokuapp.com/' + "http://realtime.ridemcts.com/bustime/api/v3/getstops?key=uSb3vFN6m4gKwnXzipg2RmwgM&rt=RED&dir=WEST&format=json";
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
// GET RED LINE 1
function RR1North(){
		var url = 'https://cors-anywhere.herokuapp.com/' + "http://realtime.ridemcts.com/bustime/api/v3/getstops?key=uSb3vFN6m4gKwnXzipg2RmwgM&rt=RR1&dir=NORTH&format=json";
	$.ajax(
  {  
    "url":url,
	"method": "GET",
    "dataType": "json",
	headers:{
		"x-requested-with": "xhr"
	},
	    "success": receiveRR1North,
    "error": function(x){alert("Error!"+JSON.stringify(x));},
  });
}

function RR1South(){
		var url = 'https://cors-anywhere.herokuapp.com/' + "http://realtime.ridemcts.com/bustime/api/v3/getstops?key=uSb3vFN6m4gKwnXzipg2RmwgM&rt=RR1&dir=SOUTH&format=json";
	$.ajax(
  {  
    "url":url,
	"method": "GET",
    "dataType": "json",
	headers:{
		"x-requested-with": "xhr"
	},
	    "success": receiveRR1South,
    "error": function(x){alert("Error!"+JSON.stringify(x));},
  });
}
// GET RED LINE 2
function RR2North(){
		var url = 'https://cors-anywhere.herokuapp.com/' + "http://realtime.ridemcts.com/bustime/api/v3/getstops?key=uSb3vFN6m4gKwnXzipg2RmwgM&rt=RR2&dir=NORTH&format=json";
	$.ajax(
  {  
    "url":url,
	"method": "GET",
    "dataType": "json",
	headers:{
		"x-requested-with": "xhr"
	},
	    "success": receiveRR2North,
    "error": function(x){alert("Error!"+JSON.stringify(x));},
  });
}

function RR2South(){
		var url = 'https://cors-anywhere.herokuapp.com/' + "http://realtime.ridemcts.com/bustime/api/v3/getstops?key=uSb3vFN6m4gKwnXzipg2RmwgM&rt=RR2&dir=SOUTH&format=json";
	$.ajax(
  {  
    "url":url,
	"method": "GET",
    "dataType": "json",
	headers:{
		"x-requested-with": "xhr"
	},
	    "success": receiveRR2South,
    "error": function(x){alert("Error!"+JSON.stringify(x));},
  });
}
//GET RED LINE 3
function RR3North(){
		var url = 'https://cors-anywhere.herokuapp.com/' + "http://realtime.ridemcts.com/bustime/api/v3/getstops?key=uSb3vFN6m4gKwnXzipg2RmwgM&rt=RR3&dir=NORTH&format=json";
	$.ajax(
  {  
    "url":url,
	"method": "GET",
    "dataType": "json",
	headers:{
		"x-requested-with": "xhr"
	},
	    "success": receiveRR3North,
    "error": function(x){alert("Error!"+JSON.stringify(x));},
  });
}

function RR3South(){
	var url = 'https://cors-anywhere.herokuapp.com/' + "http://realtime.ridemcts.com/bustime/api/v3/getstops?key=uSb3vFN6m4gKwnXzipg2RmwgM&rt=RR3&dir=SOUTH&format=json";
	$.ajax(
  {  
    "url":url,
	"method": "GET",
    "dataType": "json",
	headers:{
		"x-requested-with": "xhr"
	},
	    "success": receiveRR3South,
    "error": function(x){alert("Error!"+JSON.stringify(x));},
  });
}
//Get Route 6 Lines
function Six_East(){
	var url = 'https://cors-anywhere.herokuapp.com/' + "http://realtime.ridemcts.com/bustime/api/v3/getstops?key=uSb3vFN6m4gKwnXzipg2RmwgM&rt=6&dir=EAST&format=json";
	$.ajax(
  {  
    "url":url,
	"method": "GET",
    "dataType": "json",
	headers:{
		"x-requested-with": "xhr"
	},
	    "success": receive6East,
    "error": function(x){alert("Error!"+JSON.stringify(x));},
  });
}
function Six_West(){
	var url = 'https://cors-anywhere.herokuapp.com/' + "http://realtime.ridemcts.com/bustime/api/v3/getstops?key=uSb3vFN6m4gKwnXzipg2RmwgM&rt=6&dir=WEST&format=json";
	$.ajax(
  {  
    "url":url,
	"method": "GET",
    "dataType": "json",
	headers:{
		"x-requested-with": "xhr"
	},
	    "success": receive6West,
    "error": function(x){alert("Error!"+JSON.stringify(x));},
  });
}
function Tweleve_East(){
	var url = 'https://cors-anywhere.herokuapp.com/' + "http://realtime.ridemcts.com/bustime/api/v3/getstops?key=uSb3vFN6m4gKwnXzipg2RmwgM&rt=12&dir=EAST&format=json";
	$.ajax(
  {  
    "url":url,
	"method": "GET",
    "dataType": "json",
	headers:{
		"x-requested-with": "xhr"
	},
	    "success": receive12East,
    "error": function(x){alert("Error!"+JSON.stringify(x));},
  });
}
function Tweleve_West(){
	var url = 'https://cors-anywhere.herokuapp.com/' + "http://realtime.ridemcts.com/bustime/api/v3/getstops?key=uSb3vFN6m4gKwnXzipg2RmwgM&rt=12&dir=EAST&format=json";
	$.ajax(
  {  
    "url":url,
	"method": "GET",
    "dataType": "json",
	headers:{
		"x-requested-with": "xhr"
	},
	    "success": receive12West,
    "error": function(x){alert("Error!"+JSON.stringify(x));},
  });
}
function Fourteen_South(){
		var url = 'https://cors-anywhere.herokuapp.com/' + "http://realtime.ridemcts.com/bustime/api/v3/getstops?key=uSb3vFN6m4gKwnXzipg2RmwgM&rt=14&dir=SOUTH&format=json";
	$.ajax(
  {  
    "url":url,
	"method": "GET",
    "dataType": "json",
	headers:{
		"x-requested-with": "xhr"
	},
	    "success": receive14South,
    "error": function(x){alert("Error!"+JSON.stringify(x));},
  });
}

function Fourteen_North(){
		var url = 'https://cors-anywhere.herokuapp.com/' + "http://realtime.ridemcts.com/bustime/api/v3/getstops?key=uSb3vFN6m4gKwnXzipg2RmwgM&rt=14&dir=NORTH&format=json";
	$.ajax(
  {  
    "url":url,
	"method": "GET",
    "dataType": "json",
	headers:{
		"x-requested-with": "xhr"
	},
	    "success": receive14North,
    "error": function(x){alert("Error!"+JSON.stringify(x));},
  });
}
function Fifteen_South(){
		var url = 'https://cors-anywhere.herokuapp.com/' + "http://realtime.ridemcts.com/bustime/api/v3/getstops?key=uSb3vFN6m4gKwnXzipg2RmwgM&rt=15&dir=SOUTH&format=json";
	$.ajax(
  {  
    "url":url,
	"method": "GET",
    "dataType": "json",
	headers:{
		"x-requested-with": "xhr"
	},
	    "success": receive15South,
    "error": function(x){alert("Error!"+JSON.stringify(x));},
  });
}
function Fifteen_North(){
		var url = 'https://cors-anywhere.herokuapp.com/' + "http://realtime.ridemcts.com/bustime/api/v3/getstops?key=uSb3vFN6m4gKwnXzipg2RmwgM&rt=15&dir=SOUTH&format=json";
	$.ajax(
  {  
    "url":url,
	"method": "GET",
    "dataType": "json",
	headers:{
		"x-requested-with": "xhr"
	},
	    "success": receive15North,
    "error": function(x){alert("Error!"+JSON.stringify(x));},
  });
}
function Seventeen_East(){
	var url = 'https://cors-anywhere.herokuapp.com/' + "http://realtime.ridemcts.com/bustime/api/v3/getstops?key=uSb3vFN6m4gKwnXzipg2RmwgM&rt=17&dir=EAST&format=json";
	$.ajax(
  {  
    "url":url,
	"method": "GET",
    "dataType": "json",
	headers:{
		"x-requested-with": "xhr"
	},
	    "success": receive17East,
    "error": function(x){alert("Error!"+JSON.stringify(x));},
  });
}
function Seventeen_West(){
	var url = 'https://cors-anywhere.herokuapp.com/' + "http://realtime.ridemcts.com/bustime/api/v3/getstops?key=uSb3vFN6m4gKwnXzipg2RmwgM&rt=17&dir=WEST&format=json";
	$.ajax(
  {  
    "url":url,
	"method": "GET",
    "dataType": "json",
	headers:{
		"x-requested-with": "xhr"
	},
	    "success": receive17West,
    "error": function(x){alert("Error!"+JSON.stringify(x));},
  });
}
function Nineteen_North(){
		var url = 'https://cors-anywhere.herokuapp.com/' + "http://realtime.ridemcts.com/bustime/api/v3/getstops?key=uSb3vFN6m4gKwnXzipg2RmwgM&rt=19&dir=NORTH&format=json";
	$.ajax(
  {  
    "url":url,
	"method": "GET",
    "dataType": "json",
	headers:{
		"x-requested-with": "xhr"
	},
	    "success": receive19North,
    "error": function(x){alert("Error!"+JSON.stringify(x));},
  });
}
function Nineteen_South(){
		var url = 'https://cors-anywhere.herokuapp.com/' + "http://realtime.ridemcts.com/bustime/api/v3/getstops?key=uSb3vFN6m4gKwnXzipg2RmwgM&rt=19&dir=SOUTH&format=json";
	$.ajax(
  {  
    "url":url,
	"method": "GET",
    "dataType": "json",
	headers:{
		"x-requested-with": "xhr"
	},
	    "success": receive19South,
    "error": function(x){alert("Error!"+JSON.stringify(x));},
  });
}
function Twenty_One_East(){
	var url = 'https://cors-anywhere.herokuapp.com/' + "http://realtime.ridemcts.com/bustime/api/v3/getstops?key=uSb3vFN6m4gKwnXzipg2RmwgM&rt=21&dir=EAST&format=json";
	$.ajax(
  {  
    "url":url,
	"method": "GET",
    "dataType": "json",
	headers:{
		"x-requested-with": "xhr"
	},
	    "success": receive21East,
    "error": function(x){alert("Error!"+JSON.stringify(x));},
  });
}
function Twenty_One_West(){
	var url = 'https://cors-anywhere.herokuapp.com/' + "http://realtime.ridemcts.com/bustime/api/v3/getstops?key=uSb3vFN6m4gKwnXzipg2RmwgM&rt=21&dir=WEST&format=json";
	$.ajax(
  {  
    "url":url,
	"method": "GET",
    "dataType": "json",
	headers:{
		"x-requested-with": "xhr"
	},
	    "success": receive21West,
    "error": function(x){alert("Error!"+JSON.stringify(x));},
  });
}
function Twenty_Two_East(){
	var url = 'https://cors-anywhere.herokuapp.com/' + "http://realtime.ridemcts.com/bustime/api/v3/getstops?key=uSb3vFN6m4gKwnXzipg2RmwgM&rt=22&dir=EAST&format=json";
	$.ajax(
  {  
    "url":url,
	"method": "GET",
    "dataType": "json",
	headers:{
		"x-requested-with": "xhr"
	},
	    "success": receive22East,
    "error": function(x){alert("Error!"+JSON.stringify(x));},
  });
}
function Twenty_Two_West(){
	var url = 'https://cors-anywhere.herokuapp.com/' + "http://realtime.ridemcts.com/bustime/api/v3/getstops?key=uSb3vFN6m4gKwnXzipg2RmwgM&rt=22&dir=WEST&format=json";
	$.ajax(
  {  
    "url":url,
	"method": "GET",
    "dataType": "json",
	headers:{
		"x-requested-with": "xhr"
	},
	    "success": receive22West,
    "error": function(x){alert("Error!"+JSON.stringify(x));},
  });
}

//CODE FOR BREAKING APART STOPS
