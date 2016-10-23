

/*

Utility
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



var Utility  = function () {

	var self = this;

	this.truncate = function (number, decimal) {

		var value = Math.floor(number*Math.pow(10, decimal))/Math.pow(10, decimal);
		
		return value;
	}

	this.average  = function (array) {
		
		var sumX = 0;
		var sumY = 0;
		
		for (i in array) {
			sumX += array[i].x;
			sumY += array[i].y;
		}
		
		return new Vector(sumX/array.length, sumY/array.length, array[array.length-1].time);
			
	}

	this.getRandomPosition = function (arena) {
		var side = Math.random();
		var loc = Math.random();
		
		if (side < 0.25) { //top
			return new Vector(loc*$(arena).width(), -100,0);
		}
		else if (side < 0.5) { //right
			return new Vector($(arena).width() +100, loc*$(arena).height(), 0);
		}
		else if (side < 0.75 ) { //bottom
			return new Vector(loc*$(arena).width(), $(arena).height() + 100, 0);
		}
		else if (side < 1) { //left
			return new Vector(-100, loc*$(arena).height(), 0);
		}
		
	}

	this.getRandomVelocity = function (arena, pos) {
		
		var marginY = 100;
		var marginX = 50;
		var spread = 20;
		var minimum = 20;
		
		var box = {top:marginY, left:marginX, width:$(arena).width() - 2*marginX, height:$(arena).height() - 2*marginY};
		
		var topRand = Math.random();
		var leftRand = Math.random();
		var speed = spread*Math.random() + minimum;
		
		var end = new self.Vector(leftRand*box.width + box.left, topRand*box.height + box.top, 0);
		
		var vector = end.subtract(pos).unit();
		
		return vector.multiply(speed);
		
	}

	this.getDestroyPosition = function (pos, i) {
		return pos[i];
	}

	this.intersectRect = function (one, two) {
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

	this.intersectShape = function (one, two) {

		if (one.shape == square || two.shape == square) {
			return intersectRect(one.container, two.container);	
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

}