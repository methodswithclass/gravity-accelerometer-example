
/*

Obj
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



var circle = "cicrle";
var square = "square";


var Obj = function (parent) {
	
	
	var self = this;
	
	var shape = circle;
	var radius = 50;
	
	container = document.createElement("div");
	container.classList.add("obj");
	container.style.width = 2*radius + "px";
	container.style.height = 2*radius + "px";
	if (shape == circle) 
		container.style.borderRadius = radius + "px";
	
	this.getXBound = function () {
		self.xMax = $(parent).width()/2 - $(container).width()/2;
	
		return self.xMax;
	}
	
	this.getYBound = function () {
		self.yMax = $(parent).height()/2 - $(container).height()/2;
	
		return self.yMax;
	}
	
	
	
	var relPos = {x:0, y:0};
	
	var position = {x:0, y:0};
	var velocity = {x:0, y:0};
	var acceleration = {x:0, y:0};
	
	this.setPosition = function (pos) {
		relPos = pos;
		
		self.getXBound();
		self.getYBound();
		
		position = {x:self.xMax + relPos.x, y:self.yMax + relPos.y};
		
		//con.log("position: " + self.position.x + " " + self.position.y);
		
		container.style.left = utility.truncate(position.x,0) + "px";
		container.style.top = utility.truncate(position.y,0) + "px";
	}
	
	this.setVelocity = function (vel) {
		//con.log("velX: " + vel.x + " velY: " + vel.y);
		self.velocity = vel;
	}

	this.setAcceleration = function (acc) {

		self.acceleration = acc;
	}

	this.hide = function () {

		$(container).hide();
	}

	this.show = function () {

		$(parent).append(container);
	}

	this.getPosition = function () {

		return position;
	}

	this.getVelocity = function () {

		return velocity;
	}

	this.getAcceleration = function () {

		return acceleration;
	}
	
	this.setPosition(relPos);
}




