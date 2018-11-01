$(start);
function start(){
	
	
  $("#getdata").click(route);
  
}
function route(){
	var url = "http://realtime.ridemcts.com/bustime/api/v3/getdirections?key=uSb3vFN6m4gKwnXzipg2RmwgM&rt=GRE&format=json";
	
	
	$.ajax(
  {
    "url":url,
    "success": receiveroute,
    "error": function(x){alert("Error!"+JSON.stringify(x));},
    "dataType": "json"
  });
	
}
function receiveroute(result){
	$("#route").html(result);
	
}