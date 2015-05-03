

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
	
	this.showConsole = false;
	
	this.interval = params.interval;
	
	this.getBounds = function () {
	
		self.xMax = obj.getXBound();
		self.yMax = obj.getYBound();
		
	}
	
	window.addEventListener("orient", this.getBounds);
	
	this.getBounds();
		
	var filterBucket = [];
	var filterSize = params.filterSize;

	var threshold;
	
	this.unfiltered = new Vector(0,0,0);
	this.accel0 = new Vector(0,0,0);
	this.vel0 = new Vector(0,0,0);
	this.vel1 = new Vector(0,0,0);
	this.pos0 = new Vector(0,0,0);
	this.pos1 = new Vector(0,0,0);
	this.startTime = 0;
	
	this.position = {x:this.pos0.x, y:this.pos0.y};
	this.velocity = {x:this.vel0.x, y:this.vel0.y};
	
	this.mu = params.mu;
	this.damp = params.damp;
	
	this.running = false;

	this.setValues = function () {

		this.factor = globals.factor*params.factor;
		this.xDir = globals.xDir;
		this.yDir = globals.yDir;
		threshold = this.factor*0.5;

	}
	
	this.motion = function (e) {
		
		//con.log("motion");
		
		if (self.running) {
			
			//con.log("motion on");
			
			if (params.gravity) {
				self.unfiltered.x = self.xDir*self.factor*e.accelerationIncludingGravity.x;
				self.unfiltered.y = self.yDir*self.factor*e.accelerationIncludingGravity.y;
			}
			else {
				self.unfiltered.x = self.xDir*self.factor*e.acceleration.x;
				self.unfiltered.y = self.yDir*self.factor*e.acceleration.y;
			}
			
			self.unfiltered.time = (e.timeStamp - self.startTime)/1000;
			
			if (self.showConsole)
				con.log("unfiltered: " + self.unfiltered.printValues());
		}
	}
	
	this.start = function () {
		
		console.log("running");

		self.setValues();
		
		self.running = true;
		
		var date = new Date();
		self.startTime = date.getTime();
		
		self.timer = setInterval(function () {
			
			filterBucket[filterBucket.length] = self.unfiltered;
				
			if (filterBucket.length == filterSize) {
				
				self.integrate(filterBucket);
				
				filterBucket = [];	
			}
				
		}, 1000*self.interval);
	}
	
	this.stop = function () {
		
		con.log("stopped");
		
		self.running = false;
		
		if (self.timer) {
			clearInterval(self.timer);	
		}
		
		//self.reset();
	}
	
	this.integrate = function (accelArray) {
		
		self.accel1 = utility.average(accelArray);
		
		if (self.accel1.len() < threshold) {
			self.accel1 = new Vector(0,0,self.accel1.time);
		}
		
		var timeInterval = 1000*self.interval*filterSize;
		
		self.vel1 = self.vel0.add(self.accel0.multiply(timeInterval)).add(self.accel1.subtract(self.accel0).multiply(0.5*timeInterval));
		
		self.pos1 = self.pos0.add(self.vel0.multiply(timeInterval)).add(self.vel1.subtract(self.vel0).multiply(0.5*timeInterval));
		
		self.bounce();
		
		self.friction();
		
		/*if (self.showConsole)
			self.logOnInterval();*/
		
		self.updateMotion(self.pos1, self.vel1, self.accel1);
		
		self.pos0 = self.pos1;
		self.vel0 = self.vel1;
		self.accel0 = self.accel1;
		
	}
	
	this.bounce = function () {
		
		var sideX = self.pos1.x/Math.abs(self.pos1.x);
		
		var minVel = 12*(Math.abs(self.accel1.y)+Math.abs(self.accel1.x));
		
		if (Math.abs(self.pos1.x) >= self.xMax) {
			self.pos1.x	= sideX*self.xMax;
			self.vel1.x = -(1-self.damp)*self.vel1.x;
			if (Math.abs(self.vel1.x) < minVel && params.gravity) {
				self.vel1.x = 0;	
			}
		}
		
		
		var sideY = self.pos1.y/Math.abs(self.pos1.y);
		
		if (Math.abs(self.pos1.y) >= self.yMax) {
			self.pos1.y	= sideY*self.yMax;
			self.vel1.y = -(1-self.damp)*self.vel1.y;
			if (Math.abs(self.vel1.y) < minVel && params.gravity) {
				self.vel1.y = 0;
			}
		}
			
	}
	
	this.friction = function () {
		
		if (self.accel1.len() == 0) {
			self.vel1 = self.vel1.multiply(1-self.mu);	
		}
	}
	
	
	
	this.reset = function () {
		
		filterBucket = [];
		
		self.unfiltered = new Vector(0,0,0);
		self.accel0 = new Vector(0,0,0);
		self.vel0 = new Vector(0,0,0);
		self.pos0 = new Vector(0,0,0);
		self.startTime = 0;
		
		self.updateMotion(self.pos0, self.vel0);	
	}
	
	this.logOnInterval = function () {
		
		if (self.accel1.len() > 0) {
			con.log("accel: " + self.accel1.printValues() + " len: " + self.accel1.len());
			//self.log("vel: " + self.vel1.printValues());
			con.log("pos: " + self.pos1.printValues());
			
			con.log(" ");
		}
	}
	
	this.updateMotion = function (pos, vel, acc) {
		
		//con.log("update " + xPos + " " + yPos);
		
		var evt = new CustomEvent("accel", {detail:{pos:pos, vel:vel, acc:acc}, bubbles:true, cancelable:false});
		
		window.dispatchEvent(evt);
			
	}
	
	this.getMotion = function (func) {
		
		window.addEventListener("accel", function (e) {
			func(e.detail.pos, e.detail.vel, e.detail.acc);
		}, false);
			
	}

	this.getAccel = function () {

		return self.accel1;
	}
	
	this.listTime = function () {
		self.obj.innerHTML = self.acceleration.time;	
	}
		
}