var canv = document.getElementById("myCanvas");
var context = canv.getContext("2d");
var rect = canv.getBoundingClientRect();
window.blockMenuHeaderScroll = false;
var points=[];
var shapes=[[]];

class pointCollection{
	constructor(points){
		this.points=pointsl
	}
	getBounds(){

	}
	getConvexHull(){
		
	}
}

var clearAll=function(){
	points=[];
	shapes=[[]];
	context.beginPath();
	context.fillStyle = "white";
	context.fillRect(0, 0, canv.width, canv.height);
	var h3=document.getElementById("displayArea");
	h3.innerHTML="Area:= TBD";
}

document.addEventListener('keypress',function(event){
	console.log(event.keyCode);
	if(event.keyCode==114){
		clearAll();
	}
	if(event.keyCode==115){
		shapes.push([]);
		points=[];
	}
});
/*
window.addEventListener("touchstart",function(event){
	blockMenuHeaderScroll = true;
	return false;
})
window.addEventListener("touchend",function(event){
	blockMenuHeaderScroll = false;
})
canv.addEventListener("touchmove",function(event){
	var x = event.clientX;
    var y = event.clientY-rect.top;
    var h3=document.getElementById("displayArea");
    points.push([x,y]);
    context.fillStyle="red";
	context.beginPath();
    context.arc(x,y,3,0,2*Math.PI);
    context.fill();
})
*/
canv.addEventListener("mousemove",function(event){
	if (event.which==1){
		var x = event.clientX;
        var y = event.clientY-rect.top;
        points.push([x,y]);
        context.fillStyle="red";
		context.beginPath();
	    context.arc(x,y,3,0,2*Math.PI);
	    context.fill();
	}
})

canv.addEventListener('mouseup', function(event) {
        if(points.length>2) {
        	shapes[shapes.length-1]={points:points,hull:convexHull(points)};
        	clearScreen();
        	var totalArea=0;
        	shapes.forEach(function(points1){
        		hull=convexHull(points1);
        		update(points1,hull);	
        		drawPoints(points1,hull);
        	});
        }
        console.log(shapes);
     }, false); 

function clearScreen(){
	context.fillStyle = "white";
	context.fillRect(0, 0, canv.width, canv.height);
}


function update(points,hull){
	drawPolygon(hull);
	var bounds=drawRectangle(hull);
	var randomPoints=generateRandomPoints(bounds);
	var positives=drawRandomPoints(randomPoints,hull);
	var area = (positives/randomPoints.length)*(bounds[2]-bounds[0])*(bounds[3]-bounds[1]);
	area=Math.round(area);
	var h3=document.getElementById("displayArea");
	h3.innerHTML="Area:= "+area+"px";
}

function drawRandomPoints(points,hull){
	var pointsInRegion=0;
	for(var i =0;i<points.length;i++){
		context.beginPath();
		if (checkIfPointInHull(points[i],hull)) {
			context.fillStyle="green";
			pointsInRegion+=1;
		}
		else context.fillStyle="rgba(100,100,100,0.5)";
		context.arc(points[i][0],points[i][1],1,0,2*Math.PI);
		context.fill();
	}
	return pointsInRegion;
}
function checkIfPointInHull(point, hull) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

    var x = point[0], y = point[1];

    var inside = false;
    for (var i = 0, j = hull.length - 1; i < hull.length; j = i++) {
        var xi = hull[i][0], yi = hull[i][1];
        var xj = hull[j][0], yj = hull[j][1];

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
};

var generateRandomPoints=function(bounds){
	var density = 250.0/10000;
	var resultingPoints=[];
	var ammount = density*(bounds[2]-bounds[0])*(bounds[3]-bounds[1]);
	for(var i =0;i<ammount;i++){
		var x = Math.random()*(bounds[2]-bounds[0])+bounds[0];
		var y = Math.random()*(bounds[3]-bounds[1])+bounds[1];
		resultingPoints.push([x,y]);
	}
	return resultingPoints;
}

var drawRectangle=function(hull){
	var minh=hull[0][1];
	var maxh=hull[0][1];
	var minw=hull[0][0];
	var maxw=hull[0][0];
	for(var i =1;i<hull.length;i++){
		if (hull[i][0]>maxw) maxw=hull[i][0];
		if (hull[i][0]<minw) minw=hull[i][0];
		if (hull[i][1]>maxh) maxh=hull[i][1];
		if (hull[i][1]<minh) minh=hull[i][1];
	}
	context.beginPath();
	context.rect(minw,minh,maxw-minw,maxh-minh);
	context.strokeStyle="black";
	context.stroke();
	return [minw,minh,maxw,maxh];
}

var drawPoints=function(points,hull){
	for (var i =0;i<points.length;i++){
			if(hull!=undefined) if(hull.indexOf(points[i])==-1) continue;
			context.fillStyle="red";
			context.beginPath();
	        context.arc(points[i][0],points[i][1],3,0,2*Math.PI);
	        context.fill();
    	}
}

var drawPolygon=function(points){
	
	context.strokeStyle = "red";
	context.beginPath();
	context.moveTo(points[0][0],points[0][1]);
	for (var i = 1;i<points.length;i++){
		context.lineTo(points[i][0],points[i][1]);
	}
	context.lineTo(points[0][0],points[0][1]);
	//context.closePath();
	context.stroke();
}

function cross(a, b, o) {
   return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
}

var convexHull=function(points2) {
   points2.sort(function(a, b) {
      return a[0] == b[0] ? a[1] - b[1] : a[0] - b[0];
   });
   var lower = [];
   for (var i = 0; i < points2.length; i++) {
      while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], points2[i]) <= 0) {
         lower.pop();
      }
      lower.push(points2[i]);
   }

   var upper = [];
   for (var i = points2.length - 1; i >= 0; i--) {
      while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], points2[i]) <= 0) {
         upper.pop();
      }
      upper.push(points2[i]);
   }
   upper.pop();
   lower.pop();
   return lower.concat(upper);
}