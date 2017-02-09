window.onload = function() {

	// Get a reference to the canvas object
	var canvas = document.getElementById('Canvas');
	// Create an empty project and a view for the canvas:
	paper.setup(canvas);
	paper.install(window);

	/*var path = new Path();
		// Give the stroke a color
		path.strokeColor = 'black';
		var start = new Point(100, 100);
		// Move to start and draw a line from there
		path.moveTo(start);
		// Note the plus operator on Point objects.
		// PaperScript does that for us, and much more!
		path.lineTo(start + [ 100, -50 ]);*/

	/*var path = new Path.Circle({
		center: view.center,
		radius: 30,
		strokeColor: 'black'
	});*/

	var tool = new Tool();
	tool.minDistance = 25;
	tool.maxDistance = 45;

	var path;
	var totalPoints = 0;
	var ready = false;
	var editPoint;
	var savedPath;

	var paths = [];

	Point.prototype.plus = function( point, mult = 1.0 ){
		var p = new Point();
		p.x = this.x + point.x*mult;
		p.y = this.y + point.y*mult;
		return p;
	}

	Point.prototype.minus = function( point, mult = 1.0 ){
		var p = new Point();
		p.x = this.x - point.x*mult;
		p.y = this.y - point.y*mult;
		return p;
	}

	tool.onMouseDown = function(event){
		console.log( 'onMouseDown' );

		/*path = new Path();
		path.strokeColor = '#00000';
		path.selected = true;*/

		path = new Path();
		/*path.fillColor = {
			hue: Math.random() * 360,
			saturation: 1,
			brightness: 1
		};*/
		path.fillColor = color;

		console.log( color );

		path.add(event.point);
		totalPoints++;
		//console.log( path );
		
	}

	tool.onMouseDrag = function(event){
		//console.log( 'onMouseDrag' );

		var step = event.delta;
		step.angle += 90;

		var top = event.middlePoint.plus(step, .5);
		var bottom = event.middlePoint.minus(step, .5);

		/*console.log( top, typeof top );
		console.log( bottom, typeof bottom );
		return;

		console.log( "top:", top );
		console.log( "bottom:", bottom );*/
		
		/*var line = new Path();
		line.strokeColor = '#000000';
		line.add(top);
		line.add(bottom);*/

		path.add(top);
		path.insert(0, bottom);
		totalPoints += 2;
		path.smooth();
	}

	tool.onMouseUp = function(event){
		//console.log( 'onMouseUp' );
		path.add(event.point);
		totalPoints++;

		path.closed = true;
		path.smooth();


		editPoints( path );
		//return;
        //paper.view.attach('frame', moveSeg);
        paths.push( path );
	}

	var updatePaths = function(){
		var currPath;
		//console.log( paths.length );
		for ( var i = 0, len = paths.length; i < len; i++ ){
			currPath = paths[i];

			for ( var j = 0, jlen = currPath.segments.length; j < jlen; j++ ){
	        	var segment = currPath.segments[j];
	        	segment.wiggle.update();
	        	segment.point.x = segment.origin.x + segment.wiggle.x;
	        	segment.point.y = segment.origin.y + segment.wiggle.y;
	        }

	        currPath.smooth();
		}
	}


	var mult;
	var time = 0;
	function step(timestamp) {
		//time += .01;
	  	//mult = Math.cos(time);

	  	updatePaths();
	  	//console.log( mult );
	  	requestAnimationFrame( step );
	}

	window.requestAnimationFrame(step);


    var editPoints = function(path){
    	for ( var i = 0, len = path.segments.length; i < len; i++ ){
        	var segment = path.segments[i];
        	segment.wiggle = {
        		seed: {
        			x: Math.random()*99999,
        			y: Math.random()*99999
        		},
        		x: 0,
        		y: 0,
        		weight: {
        			x: Math.random()*4,
        			y: Math.random()*4
        		},
        		update: function(){
        			this.seed.x += 0.05;
        			this.seed.y += 0.05;
        			var multX = Math.cos( this.seed.x );
        			var multY = Math.cos( this.seed.y );

        			//console.log( this.seed, multX, multY );
        			//return;
        			this.x = multX * this.weight.x;
        			this.y = multY * this.weight.y;
        			//console.log( this.x, this.y );
        		}
        	}
        	segment.origin = {
        		x: segment.point.x,
        		y: segment.point.y
        	}
        }
    }

	var x,y;
	var color = '#7bd148';

	$( document ).on( 'mousemove', function(evt){
		x = evt.pageX;
        y = evt.pageY;
	});

	$(document).ready(function(){
		$('select[name="colorpicker-shortlist"]').simplecolorpicker();
	})

	$('select[name="colorpicker-shortlist"]').on('change', function() {
	    color = $('select[name="colorpicker-shortlist"]').val();
	});


} // END