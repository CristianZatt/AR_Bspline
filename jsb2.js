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
	  offset_base:   3,    // grass base width. greater values, wider at the basement.
		offset_meio: 10,
  
	  initialize : function(canvasWidth, canvasHeight, minHeight, maxHeight, angleMax, initialMaxAngle)  {
		
			this.color= 'green';
			this.alto_grama= minHeight+Math.random()*maxHeight;
			this.maxAngle= 10+Math.random()*angleMax;
			this.angle= Math.random()*initialMaxAngle*(Math.random()<0.5?1:-1)*Math.PI/180;
			this.alto_grama = 10;
			
			
			var a1 = {
				x: Math.floor( Math.random()* canvasWidth ), 
				y: canvasHeight };
				
			var xmeio= 0;
			if ( Math.random()<0.1 ) {
				xmeio = a1.y - this.alto_grama;
			} else {
				xmeio = a1.y - this.alto_grama/2;
			}
			
			var a2 = {
				x: a1.x - this.offset_meio, 
				y:  xmeio };
				
			var a3 = {
				x: a2.x, 
				y: a2.y};

			var b3 = {
				x: a3.x, 
				y: a3.y};
			
			var b2 = {
				x: a2.x, 
				y: a2.y};
				
			var b1 = {
				x: a1.x  - this.offset_base, 
				y: a1.y};
				
			this.coords = {a1, a2, a3, b3, b2, b1};

		},
	  
	  /**
		 * paint every grass.
		 * @param ctx is the canvas2drendering context
		 * @param time for grass animation.
		 * @returns nothing
		*/
	  paint : function(ctx,time) {
		
			var wind = Math.sin(time*0.0012);
			
			// rotate the point, so grass curves are modified accordingly. If just moved horizontally, the curbe would
			// end by being unstable with undesired visuals. 
			var ang= this.angle + Math.PI/2 + wind * Math.PI/180*(this.maxAngle*Math.cos(time*0.00025));
			
			this.coords.a3 = {
				
				x: this.coords.a2.x + this.offset_meio + this.alto_grama*Math.cos(ang), 
				y: this.coords.a2.y - this.alto_grama*Math.sin(ang)};

			this.coords.b3 = {
				x: this.coords.a3.x + this.offset_meio + this.alto_grama*Math.cos(ang) / 4, 
				y: this.coords.a3.y - this.alto_grama*Math.sin(ang) / 2};
						
			ctx.save();
			ctx.strokeStyle = "yellow";
			ctx.beginPath();
			ctx.moveTo( this.coords.a1.x, this.coords.a1.y );
			var precisao = 10;
		
			for (let i = 3; i < Object.entries(this.coords).length; i++) {
				for(var t = 0;t <= 1;t += (1/precisao)){
					let x1 = this.coords[Object.keys(this.coords)[i-3]].x
					let x2 = this.coords[Object.keys(this.coords)[i-2]].x
					let x3 = this.coords[Object.keys(this.coords)[i-1]].x
					let x4 = this.coords[Object.keys(this.coords)[i]].x
					let y1 = this.coords[Object.keys(this.coords)[i-3]].y
					let y2 = this.coords[Object.keys(this.coords)[i-2]].y
					let y3 = this.coords[Object.keys(this.coords)[i-1]].y
					let y4 = this.coords[Object.keys(this.coords)[i]].y

					let x = (Math.pow((1-t),3)/6)*x1+((3*Math.pow(t,3)-(6*Math.pow(t,2))+4)/6)*x2+((-3*Math.pow(t,3)+3*Math.pow(t,2)+3*t+1)/6)*x3+(Math.pow(t,3)/6)*x4
					let y = (Math.pow((1-t),3)/6)*y1+((3*Math.pow(t,3)-(6*Math.pow(t,2))+4)/6)*y2+((-3*Math.pow(t,3)+3*Math.pow(t,2)+3*t+1)/6)*y3+(Math.pow(t,3)/6)*y4
					
					ctx.lineTo(x,y)
				}
			}
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
	
	Garden.prototype = {
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
    
/*AFRAME.registerComponent('draw-canvas', {
    schema: {default: ''},

    init: function () {
		canvas = document.getElementById(this.data);
		ctx = canvas.getContext('2d');
		time= new Date().getTime();
		garden= new Garden();
		garden.initialize(canvas.width, canvas.height, 20, time);

		interval = setInterval(_doit, 60);
    }
	});*/
	
function init(images) {
		
	canvas= document.getElementById('s');
	ctx= canvas.getContext('2d');
	canvas.width= window.innerWidth;
	canvas.height=window.innerHeight;
  
	time= new Date().getTime();
	garden= new Garden();
	garden.initialize(canvas.width, canvas.height, 10, time);

	interval = setInterval(_doit, 30);
}
	  
window.addEventListener('load', init(null),	false);
  
  