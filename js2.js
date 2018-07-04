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
  
	  initialize : function(canvasWidth, canvasHeight, minHeight, maxHeight, angleMax, initialMaxAngle)  {
  
		// grass start position
		var sx= Math.floor( Math.random()*canvasWidth );
		var sy= canvasHeight;
		
		// quadric curve middle control point. higher values means wider grass from base to peak.
		// try offset_control_x=10 for thicker grass.
		var offset_control_x=1.5;  
		
		this.alto_grama= minHeight+Math.random()*maxHeight;
		this.maxAngle= 10+Math.random()*angleMax;
		this.angle= Math.random()*initialMaxAngle*(Math.random()<0.5?1:-1)*Math.PI/180;
  
		// hand crafted value. modify offset_control_x to play with grass curvature slope.
		var csx= sx-offset_control_x ;
  
		// grass curvature. greater values make grass bender. 
		// try with:  
		//        var csy= sy-this.alto_grama;  -> much more bended grass.
		//        var csy= sy-1;                 -> totally unbended grass.
		//        var csy= sy-this.alto_grama/2;-> original. good looking grass.
		var csy= 0;
		if ( Math.random()<0.1 ) {
		  csy= sy-this.alto_grama;
		} else {
		  csy= sy-this.alto_grama/2;
		}
			
		/**
		 I determined that both bezier curves that conform each grass should have
		 the same middle control point to be parallel.
		 You can play with psx/psy adding or removing values to slightly modify grass
		 geometry.
		**/
		var psx= csx;
		// changed var psy= csy; to
		var psy= csy-offset_control_x;
			
		// the bigger offset_control_point, the wider on its basement.
		this.offset_control_point=3;
		var dx= sx+this.offset_control_point;
		var dy= sy;      
		
		this.coords= [sx,sy,csx,csy,psx,psy,dx,dy];
			
		// grass color.
		this.color= 'green';
		
	  },
	  
	  /**
	   * paint every grass.
	   * @param ctx is the canvas2drendering context
	   * @param time for grass animation.
	   * @returns nothing
	   */
	  paint : function(ctx,time) {
  
			ctx.save();
			
			// grass peak position. how much to rotate the peak.
			// less values (ie the .0005), will make as if there were a softer wind.
			var wind = Math.sin(time*0.0012);
			
			// rotate the point, so grass curves are modified accordingly. If just moved horizontally, the curbe would
			// end by being unstable with undesired visuals. 
			var ang= this.angle + Math.PI/2 + wind * Math.PI/180*(this.maxAngle*Math.cos(time*0.00025));
			var px= this.coords[0]+ this.offset_control_point + this.alto_grama*Math.cos(ang);
			var py= this.coords[1]                  - this.alto_grama*Math.sin(ang);
	  
			var c= this.coords;
		
			ctx.beginPath();
			ctx.moveTo( c[0], c[1] );
			ctx.bezierCurveTo(c[0], c[1], c[2], c[3], px, py);
			ctx.bezierCurveTo(px, py, c[4], c[5], c[6], c[7]);
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
		
		ctx.fillStyle= gradient;
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
  
	  function init(images) {
		
		  canvas= document.getElementById('s');
		  ctx= canvas.getContext('2d');
		  canvas.width= window.innerWidth;
		  canvas.height=window.innerHeight;
  
		  garden= new Garden();
		  garden.initialize(canvas.width, canvas.height, 300);
		  		  
		  time= new Date().getTime();
		  interval = setInterval(_doit, 30);
	  }
	  
  window.addEventListener(
	  'load',
	  init(null),
	  false);
  
  