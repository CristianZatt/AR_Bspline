(function() {
	Grass = function() {
	  return this;
	};
	
	Grass.prototype= {

	  alto_grama: 0,    // altura da grama
	  maxAngle:    0,    // rotaçao maxima
	  angle:       0,      
	  coords:      null,  // coordenadas para calculo da spline
	  offset_base:   5,    // largura da base da grama
		offset_meio: 8,
		meioY: 0,
  
	  initialize : function(canvasWidth, canvasHeight, minHeight, maxHeight, angleMax, initialMaxAngle)  {
		
			this.color= 'green';
			this.alto_grama= minHeight+Math.random()*maxHeight;
			this.maxAngle= 10+Math.random()*angleMax;
			this.angle= Math.random()*initialMaxAngle*(Math.random()<0.5?1:-1)*Math.PI/180;

			var r = Math.random()

			if ( r<0.3 ) {
				this.meioY =  this.alto_grama;
			} else if ( r<0.8 )  {
				this.meioY = this.alto_grama/2;
			} else {
				this.meioY = this.alto_grama/3;	
			}
			
			var a1 = {
				x: Math.floor( Math.random()* canvasWidth ), 
				y: canvasHeight };
			var a2 = {};
				
			var a3 = {};
				
			var a4 = {};
				
			var b4 = {};
				
			var b3 = {};
			
			var b2 = {};
				
			var b1 = {
				x: a1.x  - this.offset_base, 
				y: a1.y};
				
			this.coords = {a1, a2, a3, a4, b4, b3, b2, b1};

		},
	  
	  /**
		 * pinta cada grama.
		 * @param ctx 
		 * @param time tempo para animaçao.
		 * @returns nada
		*/
	  paint : function(ctx,time) {
		
			var wind = Math.sin(time*0.0012);
			
			// rotaciona
			var ang= this.angle + Math.PI/2 + wind * Math.PI/180*(this.maxAngle*Math.cos(time*0.00025));
			
			
			this.coords.a2 = {
				x: this.coords.a1.x + this.alto_grama*Math.cos(ang), 
				y: this.coords.a1.y - this.alto_grama*Math.sin(ang)};
				
			this.coords.a3 = {
				x: this.coords.a2.x + this.alto_grama*Math.cos(ang), 
				y: this.coords.a2.y - this.alto_grama*Math.sin(ang) + ((this.coords.a2.y - this.coords.a1.y))};
				
			this.coords.a4 = {
				x: this.coords.a3.x +  ((this.coords.a3.x - this.coords.a2.x)/2) + this.alto_grama*Math.cos(ang), 
				y: this.coords.a3.y -  this.meioY + ((this.coords.a3.y*4 - this.coords.a2.y*5)/40)  + this.alto_grama*Math.sin(ang)};
				
			this.coords.b4 = {
				x: this.coords.a4.x -5 , 
				y: this.coords.a4.y -5};
				
			this.coords.b2 = {
				x: this.coords.b1.x - this.offset_meio + this.alto_grama*Math.cos(ang) , 
				y: this.coords.b1.y - this.alto_grama*Math.sin(ang) };
					
			this.coords.b3 = {
				x: this.coords.b2.x + this.alto_grama*Math.cos(ang) , 
				y: this.coords.b2.y - this.alto_grama*Math.sin(ang) + ((this.coords.b2.y - this.coords.b1.y))};
			
						
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
			ctx.lineTo(this.coords.b1.x,this.coords.b1.y)
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
					height / 20,      // altura minima da grama
					height / 4, // altura maxima da grama
					20,     // angulo inicial maximo 
					40      // angulo márimo para random 
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
		garden.initialize(canvas.width, canvas.height, 40);

		interval = setInterval(_doit, 30);
    }
	});
	
function init(images) {
		
	canvas= document.getElementById('s');
	ctx= canvas.getContext('2d');
	canvas.width= window.innerWidth;
	canvas.height=window.innerHeight;
  
	time= new Date().getTime();
	garden= new Garden();
	garden.initialize(canvas.width, canvas.height, 50);

	interval = setInterval(_doit, 30);
}
  
  
