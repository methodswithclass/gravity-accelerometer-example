

/*

Accelerometer
Copyright (C) 2015  Christopher Polito

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with this program; if not, write to the Free Software Foundation, Inc.,
51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.


*/




var globals = {
	factor:0.001,
	yDir:-1,
	xDir:1,
	dist:20 //cm
};

var master = {
	params: {
		interval:1/300,
		filterSize:3,
		factor:1,
		mu:0.1,
		damp:0.4,
		gravity:true
	}
};




	
var Accelerometer = function (params, obj) {

	var self = this;
	
	var showConsole = false;
	
	var interval = params.interval;
	
	this.getBounds = function () {
	
		self.xMax = obj.getXBound();
		self.yMax = obj.getYBound();
		
	}
	
	window.addEventListener("orient", this.getBounds);
	
	this.getBounds();
		
	var filterBucket = [];
	var filterSize = params.filterSize;

	var factor;
	var xDir;
	var yDir;
	var threshold;
	
	var unfiltered = new Vector(0,0,0);
	var accel1;
	var accel0 = new Vector(0,0,0);
	var vel0 = new Vector(0,0,0);
	var vel1 = new Vector(0,0,0);
	var pos0 = new Vector(0,0,0);
	var pos1 = new Vector(0,0,0);
	var startTime = 0;
	
	var position = {x:pos0.x, y:pos0.y};
	var velocity = {x:vel0.x, y:vel0.y};
	
	var mu = params.mu;
	var damp = params.damp;

	var running = false;
	var timer;

	var setValues = function () {

		factor = globals.factor*params.factor;
		xDir = globals.xDir;
		yDir = globals.yDir;
		threshold = factor*0.5;

	}
	
	var bounce = function () {
		
		var sideX = pos1.x/Math.abs(pos1.x);
		
		var minVel = 12*(Math.abs(accel1.y)+Math.abs(accel1.x));
		
		if (Math.abs(pos1.x) >= self.xMax) {
			pos1.x	= sideX*self.xMax;
			vel1.x = -(1-damp)*vel1.x;
			if (Math.abs(vel1.x) < minVel && params.gravity) {
				vel1.x = 0;	
			}
		}
		
		
		var sideY = pos1.y/Math.abs(pos1.y);
		
		if (Math.abs(pos1.y) >= self.yMax) {
			pos1.y	= sideY*self.yMax;
			vel1.y = -(1-damp)*vel1.y;
			if (Math.abs(vel1.y) < minVel && params.gravity) {
				vel1.y = 0;
			}
		}
			
	}
	
	var friction = function () {
		
		if (accel1.len() == 0) {
			vel1 = vel1.multiply(1-mu);	
		}
	}
	
	
	
	var reset = function () {
		
		filterBucket = [];
		
		unfiltered = new Vector(0,0,0);
		accel0 = new Vector(0,0,0);
		vel0 = new Vector(0,0,0);
		pos0 = new Vector(0,0,0);
		startTime = 0;
		
		updateMotion(self.pos0, self.vel0);	
	}

	var updateMotion = function (pos, vel, acc) {
		
		//con.log("update " + xPos + " " + yPos);
		
		var evt = new CustomEvent("accel", {detail:{pos:pos, vel:vel, acc:acc}, bubbles:true, cancelable:false});
		
		window.dispatchEvent(evt);
			
	}

	var integrate = function (accelArray) {
		
		accel1 = utility.average(accelArray);
		
		if (accel1.len() < threshold) {
			accel1 = new Vector(0,0,accel1.time);
		}
		
		var timeInterval = 1000*interval*filterSize;
		
		vel1 = vel0.add(accel0.multiply(timeInterval)).add(accel1.subtract(accel0).multiply(0.5*timeInterval));
		
		pos1 = pos0.add(vel0.multiply(timeInterval)).add(vel1.subtract(vel0).multiply(0.5*timeInterval));
		
		bounce();
		
		friction();
		
		/*if (self.showConsole)
			self.logOnInterval();*/
		
		updateMotion(pos1, vel1, accel1);
		
		pos0 = pos1;
		vel0 = vel1;
		accel0 = accel1;
		
	}
	
	var logOnInterval = function () {
		
		if (accel1.len() > 0) {
			con.log("accel: " + accel1.printValues() + " len: " + accel1.len());
			//self.log("vel: " + self.vel1.printValues());
			con.log("pos: " + pos1.printValues());
			
			con.log(" ");
		}
	}

	this.motion = function (e) {
		
		//con.log("motion");
		
		if (running) {
			
			//con.log("motion on");
			
			if (params.gravity) {
				unfiltered.x = xDir*factor*e.accelerationIncludingGravity.x;
				unfiltered.y = yDir*factor*e.accelerationIncludingGravity.y;
			}
			else {
				unfiltered.x = xDir*factor*e.acceleration.x;
				unfiltered.y = yDir*factor*e.acceleration.y;
			}
			
			unfiltered.time = (e.timeStamp - startTime)/1000;
			
			if (showConsole)
				con.log("unfiltered: " + unfiltered.printValues());
		}
	}

	
	
	this.start = function () {
		
		console.log("running");

		setValues();
		
		running = true;
		
		var date = new Date();
		startTime = date.getTime();
		
		timer = setInterval(function () {
			
			filterBucket[filterBucket.length] = unfiltered;
				
			if (filterBucket.length == filterSize) {
				
				integrate(filterBucket);
				
				filterBucket = [];	
			}
				
		}, 1000*interval);
	}
	
	this.stop = function () {
		
		con.log("stopped");
		
		running = false;
		
		if (timer) {
			clearInterval(timer);	
		}
		
		//self.reset();
	}
	
	this.getMotion = function (func) {
		
		window.addEventListener("accel", function (e) {
			func(e.detail.pos, e.detail.vel, e.detail.acc);
		}, false);
			
	}

	this.getAccel = function () {

		return accel1;
	}
		
}