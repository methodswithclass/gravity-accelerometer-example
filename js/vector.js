

/*

Vector
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