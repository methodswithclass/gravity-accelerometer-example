



var Vector = function (x, y, time) {
	
	var self = this;
	
	this.x = x;
	this.y = y;
	this.time = time;
	
	this.len = function () {
		return Math.sqrt(self.x*self.x + self.y*self.y);	
	}
	
	this.add = function (vector) {
		return new Vector(self.x+vector.x, self.y+vector.y, self.time);	
	}
	
	this.subtract = function(vector) {
		return new Vector(self.x-vector.x, self.y-vector.y, self.time);	
	}
	
	this.multiply = function (scalar) {
		return new Vector(self.x*scalar, self.y*scalar, self.time);	
	}
	
	this.unit = function () {
		
		if (self.len() > 0) {
			return self.multiply(1/self.len());
		}
		else {
			return new Vector(0,0,0);	
		}
		
		
	}
	
	this.printValues = function () {
		return "x: " + truncate(self.x, 2) + " y: " + truncate(self.y, 2) + " t: " + truncate(self.time, 2);
	}

}