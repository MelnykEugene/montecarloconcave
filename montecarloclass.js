class shape{
	constructor(points){
		this.length=points.length;
		this.points=points;
	}
	setPoints(points){
		this.points=points;
		this.getConvexHull();
		this.getBounds();
		this.generateRandomPoints();
		this.getThisArea();
	}
	getConvexHull(){
	   	this.points.sort(function(a, b) {
	      	return a[0] == b[0] ? a[1] - b[1] : a[0] - b[0];
	   	});
	   	var lower = [];
	   	for (var i = 0; i < this.points.length; i++) {
	      	while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], this.points[i]) <= 0) {
	         	lower.pop();
	      	}
	      	lower.push(this.points[i]);
	   	}

	   	var upper = [];
	   	for (var i = this.points.length - 1; i >= 0; i--) {
	      	while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], this.points[i]) <= 0) {
	         	upper.pop();
	      	}
	      	upper.push(this.points[i]);
	   	}
	   	upper.pop();
	   	lower.pop();
	   	this.hull=lower.concat(upper);
	}
	getBounds(){
		var minh=this.points[0][1];
		var maxh=this.points[0][1];
		var minw=this.points[0][0];
		var maxw=this.points[0][0];
		for(var i =1;i<this.hull.length;i++){
			if (this.hull[i][0]>maxw) maxw=this.hull[i][0];
			if (this.hull[i][0]<minw) minw=this.hull[i][0];
			if (this.hull[i][1]>maxh) maxh=this.hull[i][1];
			if (this.hull[i][1]<minh) minh=this.hull[i][1];
		}
		this.minx=minw;
		this.miny=minh;
		this.maxx=maxw;
		this.maxy=maxh;
		this.boxArea=(this.maxx-this.minx)*(this.maxy-this.miny);
		return([minw,minh,maxw,maxh]);
	}
	generateRandomPoints(bounds){
		var density = 500.0/10000;
		this.getBounds();
		var resultingPoints=[];
		var ammount = density*(this.maxx-this.minx)*(this.maxy-this.miny);
		for(var i =0;i<ammount;i++){
			var x = Math.random()*(this.maxx-this.minx)+this.minx;
			var y = Math.random()*(this.maxy-this.miny)+this.miny;
			resultingPoints.push([x,y]);
		}
		this.randomPoints=resultingPoints;
		return resultingPoints;
	}

	checkIfPointInHull(point) {
	    var x = point[0], y = point[1];
	    var inside = false;
	    for (var i = 0, j = this.hull.length - 1; i < this.hull.length; j = i++) {
	        var xi = this.hull[i][0], yi = this.hull[i][1];
	        var xj = this.hull[j][0], yj = this.hull[j][1];

	        var intersect = ((yi > y) != (yj > y))
	            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
	        if (intersect) inside = !inside;
	    }
	    return inside;
	}

	getThisArea(){
		var positives=0;
		var total = this.randomPoints.length;
		var positivePoints=[];
		var negativePoints=[];
		var shape=this;
		this.randomPoints.forEach(function(point){
			if(shape.checkIfPointInHull(point)) {
				positives+=1;
				positivePoints.push(point);
			}
			else negativePoints.push(point);
		});
		var area=(positives/total)*this.boxArea;
		console.log(total);
		this.positivePoints=positivePoints;
		this.negativePoints=negativePoints;
		this.thisArea=area;
		return area;
	}

	drawPoints(){
		for (var i =0;i<this.points.length;i++){
			if(this.hull!=undefined) if(this.hull.indexOf(this.points[i])==-1) continue;
			context.fillStyle="red";
			context.beginPath();
	        context.arc(this.points[i][0],this.points[i][1],3,0,2*Math.PI);
	        context.fill();
    	}
	}
	drawShape(){
		context.strokeStyle = "red";
		context.beginPath();
		context.moveTo(this.hull[0][0],this.hull[0][1]);
		for (var i = 1;i<this.hull.length;i++){
			context.lineTo(this.hull[i][0],this.hull[i][1]);
		}
		context.lineTo(this.hull[0][0],this.hull[0][1]);
		context.stroke();
	}
	drawRectangle(){
		context.beginPath();
		context.rect(this.minx,this.miny,this.maxx-this.minx,this.maxy-this.miny);
		context.strokeStyle="black";
		context.stroke();
	}
	drawRandomPoints(){
		this.positivePoints.forEach(function(point){
			context.beginPath();
			context.fillStyle="green";
			context.arc(point[0],point[1],1,0,2*Math.PI);
			context.fill();
		});
		this.negativePoints.forEach(function(point){
			context.beginPath();
			context.fillStyle="rgba(100,100,100,1)";
			context.arc(point[0],point[1],1,0,2*Math.PI);
			//context.fill();
		});
	}
}

var canv = document.getElementById("myCanvas");
var context = canv.getContext("2d");
var rect = canv.getBoundingClientRect();
var points=[];
var shapes=[new shape(points)];

var clearAll=function(){
	points=[];
	shapes=[new shape(points)];
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
	if (shapes.length!=0 && shapes[shapes.length-1].length !=0)
	{
		points=[];
		shapes.push(new shape(points));
	}
});
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
        	shapes[shapes.length-1].setPoints(points);
        }
        clearScreen();
    	var totalArea=0;
    	shapes.forEach(function(shape){
    		totalArea+=shape.thisArea;
    		shape.drawShape();
    		shape.drawPoints();
    		shape.drawRandomPoints();
    		shape.drawRectangle();
    	});
    	var h3=document.getElementById("displayArea");
    	h3.innerHTML="Area:= "+Math.floor(totalArea)+"px";
     }, false); 

function clearScreen(){
	context.fillStyle = "white";
	context.fillRect(0, 0, canv.width, canv.height);
}


function cross(a, b, o) {
   return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
}