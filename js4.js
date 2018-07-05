/**
 * Original version http://labs.hyperandroid.com/js1k
 */
(function() {
	Grass = function() {
	  return this;
	};
	
	Grass.prototype= {
		
	  
	  alto_grama: 0,    // grass height
	  maxAngle:    0,    // maximum grass rotation angle (wind movement)
	  angle:       0,    // construction angle. thus, every grass is different to others  
	  coords:      null,  // quadric bezier curves coordinates
	  offset_control_point:   3,    // grass base width. greater values, wider at the basement.
	  canvasWidth : 0,
	  canvasHeight: 0,
  
	  initialize : function(canvasWidth, canvasHeight, minHeight, maxHeight, angleMax, initialMaxAngle)  {
		
		this.color= 'green';
		
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;
		this.alto_grama= minHeight+Math.random()*maxHeight;
		this.maxAngle= 10+Math.random()*angleMax;
		this.angle= Math.random()*initialMaxAngle*(Math.random()<0.5?1:-1)*Math.PI/180;
		var altura = this.alto_grama;
		

	  },
	  
	  /**
	   * paint every grass.
	   * @param ctx is the canvas2drendering context
	   * @param time for grass animation.
	   * @returns nothing
	   */
	  paint : function(ctx,time) {
		
		var offset_control_x=20; 
		
		var wind = Math.sin(time*0.0012);
		
		// rotate the point, so grass curves are modified accordingly. If just moved horizontally, the curbe would
		// end by being unstable with undesired visuals. 
		var ang= this.angle + Math.PI/2 + wind * Math.PI/180*(this.maxAngle*Math.cos(time*0.00025));
		//array de pontos (8 pontos)
		var a1 = {
			x: this.canvasWidth / 2, 
			y: 0 + (this.canvasHeight / 2)};
		var a2 = {
			x: a1.x - 80, 
			y:  a1.y};
			
		var a3 = {
			x: a2.x + 80 - this.alto_grama*Math.cos(ang) *20, 
			y: a2.y + 80 + this.alto_grama*Math.sin(ang) * 10};
			
		var a4 = {
			x: a3.x + 80 -  this.alto_grama*Math.cos(ang) *40, 
			y: a3.y + this.alto_grama*Math.sin(ang) * 20};
			
		var b4 = {
			x: a4.x - ((a4.x - a3.x)/2) + this.alto_grama*Math.cos(ang) *20 , 
			y: a4.y + ((a4.y - a3.y)/2)  + this.alto_grama*Math.sin(ang) *10};
			
		var b3 = {
			x: a3.x - this.alto_grama*Math.cos(ang) * 20, 
			y: a3.y + this.alto_grama*Math.sin(ang) *10};
		
		var b2 = {
			x: a2.x  - offset_control_x, 
			y: a2.y};
			
		var b1 = {
			x: a1.x  - offset_control_x, 
			y: a1.y};
			
		this.coords = [a1, a2, a3, a4, b4, b3, b2, b1];
		
			ctx.save();
			ctx.strokeStyle = "yellow";
			ctx.beginPath();
			ctx.moveTo( this.coords[0].x, this.coords[0].y );
			var precisao = 10;
			for (let i = 3; i < this.coords.length; i++) {
				for(var t = 0;t <= 1;t += (1/precisao)){
					let x1 = this.coords[i-3].x
					let x2 = this.coords[i-2].x
					let x3 = this.coords[i-1].x
					let x4 = this.coords[i].x
					let y1 = this.coords[i-3].y
					let y2 = this.coords[i-2].y
					let y3 = this.coords[i-1].y
					let y4 = this.coords[i].y
	
					let x = (Math.pow((1-t),3)/6)*x1+((3*Math.pow(t,3)-(6*Math.pow(t,2))+4)/6)*x2+((-3*Math.pow(t,3)+3*Math.pow(t,2)+3*t+1)/6)*x3+(Math.pow(t,3)/6)*x4
    				let y = (Math.pow((1-t),3)/6)*y1+((3*Math.pow(t,3)-(6*Math.pow(t,2))+4)/6)*y2+((-3*Math.pow(t,3)+3*Math.pow(t,2)+3*t+1)/6)*y3+(Math.pow(t,3)/6)*y4
					
					ctx.lineTo(x,y)
				}
			}
			ctx.moveTo( this.coords[0].x, this.coords[0].y );
			ctx.stroke();
			ctx.closePath();
			ctx.fillStyle = this.color;
			ctx.fill();
  
			ctx.restore();
			  
		}
	};
  })();
  
  (function() {
	Garden= function() {
	  return this;
	};
	
	Garden.prototype= {
	  grass:      null,
	  width:      0,
	  height:      0,
	  
	  initialize : function(width, height, size)  {
		this.width= width;
		this.height= height;
		this.grass= [];
		
		for(var i=0; i<size; i++ ) {
		  var g= new Grass();
		  g.initialize(
			  width,
			  height,
			  50,      // min grass height 
			  height*2/3, // max grass height
			  20,     // grass max initial random angle 
			  40      // max random angle for animation 
			  );
		  this.grass.push(g);
		}
	  },
	  
	  paint : function(ctx, time){
		ctx.save();
		
		ctx.globalAlpha= 1;
		
		for(i=0; i<this.grass.length; i++ ) {
		  this.grass[i].paint(ctx,time);
		}
		ctx.restore();
	  }
	};
  })();
  
  
	function _doit()    {
		//ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillRect(0,0,canvas.width,canvas.height);
		var ntime= new Date().getTime();
		var elapsed= ntime-time;
		garden.paint( ctx, elapsed );
	}
  
var interval= null;
var canvas= null;
var ctx= null;
var garden= null;

var gradient;
var time;
    
AFRAME.registerComponent('draw-canvas', {
    schema: {default: ''},

    init: function () {
		canvas = document.getElementById(this.data);
		ctx = canvas.getContext('2d');
		time= new Date().getTime();
		garden= new Garden();
		garden.initialize(canvas.width, canvas.height, 1, time);

		interval = setInterval(_doit, 60);
    }
  });