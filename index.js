	var southWest=L.latLng(42.897095, -88.537445),
	northEast=L.latLng(43.731414, -87.799988);
	bounds = L.latLngBounds(southWest, northEast);
	var map = L.map('map', {
    maxBounds: bounds,   
    maxZoom: 19,
    minZoom: 10,
});
function createButton(label, container) {
    var btn = L.DomUtil.create('button', '', container);
    btn.setAttribute('type', 'button');
    btn.innerHTML = label;
    return btn;
}

var container = L.DomUtil.create('div'),
        startBtn = createButton('Start from this location', container),
        destBtn = createButton('Go to this location', container);
map.on('click', function(e) {
    var container = L.DomUtil.create('div'),
        startBtn = createButton('Start from this location', container),
        destBtn = createButton('Go to this location', container);

    L.popup()
        .setContent(container)
        .setLatLng(e.latlng)
        .openOn(map);
});

var tryx,tryy;
	tryx = 43.089067949525;
	tryy = -87.895275000001;




map.setView([43.038902, -87.906471], 15);
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
			'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
			
		id: 'mapbox.streets'
	}).addTo(map);

/*L.Routing.control({
    waypoints: [
        L.latLng(43.175789945929,-87.919274999999),
		L.latLng(43.089107949524,-87.899883000001),
		L.latLng(43.089012949528,-87.917257000001),
		L.latLng(43.089171949522,-87.906813),
		L.latLng(tryx,tryy),
        L.latLng(43.082057949821,-87.887677000001)
    ],
    routeWhileDragging: true,
	geocoder: L.Control.Geocoder.nominatim()
}).addTo(map);
*/
var busicon = L.icon({
    iconUrl: 'blue-bus-md.png',
    

    iconSize:     [25, 25], // size of the icon
    
    iconAnchor:   [25, 25], // point of the icon which will correspond to marker's location
    
    popupAnchor:  [0,0] // point from which the popup should open relative to the iconAnchor
});

L.marker([43.089171949522,-87.906813], {icon: busicon}).addTo(map).bindPopup("49U");
L.marker([43.175789945929,-87.919274999999], {icon: busicon}).addTo(map).bindPopup("49U");
L.marker([43.089012949528,-87.917257000001], {icon: busicon}).addTo(map).bindPopup("49U");
L.marker([43.089067949525,-87.895275000001], {icon: busicon}).addTo(map).bindPopup("49U");
L.marker([43.082057949821,-87.887677000001],{icon: busicon}).addTo(map).bindPopup("49U");


L.DomEvent.on(startBtn, 'click', function() {
        control.spliceWaypoints(0, 1, e.latlng);
        map.closePopup();
    });

L.DomEvent.on(destBtn, 'click', function() {
        control.spliceWaypoints(control.getWaypoints().length - 1, 1, e.latlng);
        map.closePopup();
    });

var ReversablePlan = L.Routing.Plan.extend({
    createGeocoders: function() {
        var container = L.Routing.Plan.prototype.createGeocoders.call(this),
            reverseButton = createButton('↑↓', container);
        return container;
    }
});