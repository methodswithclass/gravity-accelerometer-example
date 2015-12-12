var Vector = function (x,y,time) {

	var self = this;

	self.x = x;
	self.y = y;
	self.time = time;

	var truncate = function (number, decimal) {

		var value = Math.floor(number*Math.pow(10, decimal))/Math.pow(10, decimal);
		
		return value;
	}
	
	self.len = function () {
		return Math.sqrt(self.x*self.x + self.y*self.y);
	}
	
	self.add = function (vector) {
		return new Vector(self.x+vector.x, self.y+vector.y, self.time);
	}
	
	self.subtract = function(vector) {
		//console.log("self " + self.printValues() + "\n Vector " + Vector.printValues());
		return new Vector(self.x-vector.x, self.y-vector.y, self.time);	
	}
	
	self.multiply = function (scalar) {
		return new Vector(self.x*scalar, self.y*scalar, self.time);	
	}
	
	self.unit = function () {
		
		if (self.len() > 0) {
			return self.multiply(1/self.len());
		}
		else {
			return new Vector(0,0,0);	
		}
		
		
	}

	self.set = function (vector) {

		self.x = vector.x;
		self.y = vector.y;
		self.time = vector.time;

		//console.log(which + " self " + self.printValues() + "\n Vector " + Vector.printValues());
	}
	
	self.printValues = function () {
		return "x: " + self.x + " y: " + self.y + " t: " + self.time;
	}

}

var Utility  = function () {

	var average = function (array) {

		var sumX = 0;
		var sumY = 0;
		
		for (i in array) {
			sumX += array[i].x;
			sumY += array[i].y;
		}
		
		return new Vector(sumX/array.length, sumY/array.length, array[array.length-1].time);
	}

	var truncate = function (number, decimal) {
	
		var value = Math.floor(number*Math.pow(10, decimal))/Math.pow(10, decimal);
		
		return value;
	}

	var getRandomPosition = function (arena) {
		var side = Math.random();
		var loc = Math.random();

		var distance = 200;
		
		if (side < 0.25) { //top
			return new Vector(loc*$(arena).width(), -distance,0);
		}
		else if (side < 0.5) { //right
			return new Vector($(arena).width() +distance, loc*$(arena).height(), 0);
		}
		else if (side < 0.75 ) { //bottom
			return new Vector(loc*$(arena).width(), $(arena).height() + distance, 0);
		}
		else if (side < 1) { //left
			return new Vector(-distance, loc*$(arena).height(), 0);
		}
		
	}

	var getRandomVelocity = function (arena, pos) {
		
		var marginY = 100;
		var marginX = 50;
		var spread = 20;
		var minimum = 40;
		
		var box = {top:marginY, left:marginX, width:$(arena).width() - 2*marginX, height:$(arena).height() - 2*marginY};
		
		var topRand = Math.random();
		var leftRand = Math.random();
		var speed = spread*Math.random() + minimum;
		
		var end = new Vector(leftRand*box.width + box.left, topRand*box.height + box.top, 0);
		
		var velocity = end.subtract(pos).unit();
		
		return velocity.multiply(speed);
		
	}

	var getDestroyPosition = function (pos, i) {
		return pos[i];
	}

	var intersectRect = function (one, two) {
		var r1 = {};
		var r2 = {};
		
		
		
		r1.left = $(one).position().left;
		r1.right = r1.left + $(one).width();
		r1.top =  $(one).position().top;
		r1.bottom = r1.top + $(one).height();
		
		r2.left = $(two).position().left;
		r2.right = r2.left + $(two).width();
		r2.top =  $(two).position().top;
		r2.bottom = r2.top + $(two).height();
		
		
		var result = !(r2.left >= r1.right || 
	           r2.right <= r1.left || 
	           r2.top >= r1.bottom ||
	           r2.bottom <= r1.top);
		
	  return result;
	}

	var intersectShape = function (one, two) {

		if (one.shape == g.c.square || two.shape == g.c.square) {
			return intersectRect(one.el(), two.el());	
		}
		else {
			
			var oneVector = new Vector(one.position.x + one.radius, one.position.y + one.radius, 0);
			var twoVector = new Vector(two.position.x + two.radius, two.position.y + two.radius, 0);
			
			var diff = oneVector.subtract(twoVector);
			
			if (diff.len() < one.radius + two.radius) {
				return true;	
			}
			else {
				
				return false;	
			}
				
		}
		
		
	}

	var overlapShape = function (one, two, margin) {

		var oneVector = new Vector(one.position.x + one.radius, one.position.y + one.radius, 0);
		var twoVector = new Vector(two.position.x + two.radius, two.position.y + two.radius, 0);
		
		var diff = oneVector.subtract(twoVector);
		
		//console.log("length: " + diff.len() + "radius: " + one.radius + " radius: " + two.radius);

		if (diff.len() < one.radius - two.radius + margin) {
			return true;	
		}
		else {
			
			return false;	
		}


	}

	var resolveDigit = function (digit) {
		if (digit < 10) {
			return "0" + digit;	
		}
		else {
			return "" + digit;	
		}
	}

	var len = function (Vector) {

		return Math.sqrt(Vector.x*Vector.x + Vector.y * Vector.y + Vector.z * Vector.z);
	}

	return {
		average:average,
		truncate:truncate,
		getRandomPosition:getRandomPosition,
		getRandomVelocity:getRandomVelocity,
		resolveDigit:resolveDigit,
		len:len,
		intersectShape:intersectShape,
		intersectRect:intersectRect,
		overlapShape:overlapShape,
		getDestroyPosition:getDestroyPosition
	}
}

var objectFactory = function (input) {

	var self = this;
	var container = input.object;
	var arena = input.arena;
	var relPos = {x:0, y:0};
	
	self.position = {x:0, y:0};
	self.velocity = {x:0, y:0};
	self.acceleration = {x:0, y:0};

	self.arena = {x:$(arena).width(), y:$(arena).height()};
	self.size = {x:$(container).width(), y:$(container).height()};
	self.bounds = {x:self.arena.x/2 - self.size.x/2, y:self.arena.y/2 - self.size.y/2};
	self.radius = self.size.x/2;

	//console.log(params.name);

	self.shape = input.params.shape;

	self.el = function () {

		return container;
	}

	self.setPosition = function (pos) {

		relPos = pos;
		
		self.position = {x:self.bounds.x + relPos.x, y:self.bounds.y + relPos.y};
		//self.center = {x:self.position.x + radius, y:self.position.y + radius};
		
		//console.log("position: " + self.position.x + " " + self.position.y);
		
		container.style.left = utility.truncate(self.position.x,0) + "px";
		container.style.top = utility.truncate(self.position.y,0) + "px";
		
	}

	self.setVelocity = function (vel) {
		//con.log("velX: " + vel.x + " velY: " + vel.y);
		self.velocity = vel;
	}

	self.setAcceleration = function (acc) {

		self.acceleration = acc;
	}

	self.absolutePos = function () {

		//console.log(relPos);

		return relPos;
	}

	self.hide = function () {

		self.setPosition(relPos);

		$(self.el()).hide();
	}

	self.show = function() {

		self.setPosition(relPos);

		$(self.el()).show();
	}

}

var accelerometer = function (input) {

	var self = this;

	var p = input.params;
	var obj = input.object;

	var filterBucket = [];

	var factor;
	var xDir;
	var yDir;
	var threshold;
	var interval;

	var filterSize;
	var mu;
	var damp;


	var unfiltered = new Vector(0,0,0);
	var accel1 = new Vector(0,0,0);
	var accel0 = new Vector(0,0,0);
	var vel0 = new Vector(0,0,0);
	var vel1 = new Vector(0,0,0);
	var pos0 = new Vector(0,0,0);
	var pos1 = new Vector(0,0,0);
	var startTime = 0;

	var position = {x:pos0.x, y:pos0.y};
	var velocity = {x:vel0.x, y:vel0.y};

	var raw = {x:0, y:0, z:0};
	self.down = 0;
	var running = false;

	self.bounds = {x:100, y:100};

	var setValues = function () {

		factor = globals.factor*p.factor;
		xDir = globals.xDir;
		yDir = globals.yDir;
		threshold = factor*0.5;
		filterSize = p.filterSize;
		mu = p.mu;
		damp = p.damp;
		interval = p.interval;

	}

	var bounce = function () {

		//console.log("bounce");
		
		var sideX = pos1.x/Math.abs(pos1.x);
		
		var minVel = 12*(Math.abs(accel1.y)+Math.abs(accel1.x));

		//console.log(sideX + " " + self.bounds.x)
		
		if (Math.abs(pos1.x) >= self.bounds.x) {

			//console.log("bounce x");
			pos1.x	= sideX*self.bounds.x;
			vel1.x = -(1-damp)*vel1.x;
			if ((Math.abs(vel1.x) < minVel && p.gravity) || !p.bounce) {
				vel1.x = 0;	
			}
		}
		
		
		var sideY = pos1.y/Math.abs(pos1.y);
		
		//console.log(sideY + " " + self.bounds.y);

		if (Math.abs(pos1.y) >= self.bounds.y) {
			//console.log("bounce y");
			pos1.y	= sideY*self.bounds.y;
			vel1.y = -(1-damp)*vel1.y;
			if ((Math.abs(vel1.y) < minVel && p.gravity) || !p.bounce) {
				vel1.y = 0;
			}
		}
			
	}

	var friction = function () {
			
		if (accel1.len() == 0) {
			vel1 = vel1.multiply(1-mu);	
		}
	}

	var updateMotion = function (pos, vel, acc) {
			
		//console.log(pos);
		
		// var evt = new CustomEvent("accel", {detail:{pos:pos, vel:vel, acc:acc}, bubbles:true, cancelable:false});
		// window.dispatchEvent(evt);

		obj.setPosition(pos);
		obj.setVelocity(vel);
		obj.setAcceleration(acc);
			
	}

	var integrate = function (accelArray) {
			
		accel1.set(utility.average(accelArray));
		
		if (accel1.len() < threshold) {
			accel1.set(new Vector(0,0,accel1.time));
		}
		
		var timeInterval = 1000*interval*filterSize;

		vel1.set(vel0.add(accel0.multiply(timeInterval)).add(accel1.subtract(accel0).multiply(0.5*timeInterval)));
		pos1.set(pos0.add(vel0.multiply(timeInterval)).add(vel1.subtract(vel0).multiply(0.5*timeInterval)));

		bounce();
		friction();
		
		updateMotion(pos1, vel1, accel1);
		
		pos0.set(pos1);
		vel0.set(vel1);
		accel0.set(accel1);
	}

	self.setinitial = function (x, y) {

		pos0.set(new Vector(x,y,pos0.time));
	}

	self.initialize = function (input) {

		self.setinitial(0,0);

		self.bounds["x"] = $(input.arena).width()/2 - obj.size.x/2;
		self.bounds["y"] = $(input.arena).height()/2 - obj.size.y/2;

	}

	self.motion = function (e) {
		
		if (running) {

			console.log(input.name + " motion");

			//console.log("motion " + e.accelerationIncludingGravity.y);

			if (p.gravity) {
				unfiltered.set(new Vector(xDir*factor*e.accelerationIncludingGravity.x, yDir*factor*e.accelerationIncludingGravity.y, (e.timeStamp - startTime)/1000));
			}
			else {
				unfiltered.set(new Vector(xDir*factor*e.acceleration.x, yDir*factor*e.acceleration.y, (e.timeStamp - startTime)/1000));
			}
		}
	}

	self.start = function () {
			
		console.log("start accel");

		setValues();
		
		running = true;
		
		startTime = (new Date()).getTime();
		
		timer = setInterval(function () {

			//console.log("local");

			//console.log("integrate");
			
			filterBucket[filterBucket.length] = unfiltered;
				
			if (filterBucket.length == filterSize) {
				
				integrate(filterBucket);
				
				filterBucket = [];	
			}
			
		}, 1000*interval);
	}
	
	self.stop = function () {
		
		console.log("stop accel");
		
		running = false;
		
		if (timer) {
			clearInterval(timer);
		}
		
		//reset();
	}

	self.getRaw = function (e) {

		raw = e.accelerationIncludingGravity;

		self.down = utility.len(raw);

		//console.log(self.down);
	}

	self.reset = function () {
		
		filterBucket = [];
		
		unfiltered = new Vector(0,0,0);
		accel0 = new Vector(0,0,0);
		vel0 = new Vector(0,0,0);
		pos0 = new Vector(0,0,0);
		startTime = 0;
		
		updateMotion(pos0, vel0, accel0);	
	}
	
	self.getMotion = function (func) {
		
		window.addEventListener("accel", function (e) {
			func(e.detail.pos, e.detail.vel, e.detail.acc);
		}, false);
			
	}

}