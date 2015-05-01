





var Obj = function (parent) {
	
	
	var self = this;
	
	this.shape = params.circle;
	this.radius = 50;
	
	this.container = document.createElement("div");
	this.container.classList.add("obj");
	this.container.style.width = 2*this.radius + "px";
	this.container.style.height = 2*this.radius + "px";
	if (this.shape == params.circle) 
		this.container.style.borderRadius = this.radius + "px";
	
	this.parent = parent.arena;
	
	this.getXBound = function () {
		self.xMax = $(self.parent).width()/2 - $(this.container).width()/2;
	
		return self.xMax;
	}
	
	this.getYBound = function () {
		self.yMax = $(self.parent).height()/2 - $(this.container).height()/2;
	
		return self.yMax;
	}
	
	
	
	this.relPos = {x:0, y:0};
	
	this.position = {x:0, y:0};
	this.velocity = {x:0, y:0};
	this.acceleration = {x:0, y:0};
	
	this.setPosition = function (pos) {
		self.relPos = pos;
		
		self.getXBound();
		self.getYBound();
		
		self.position = {x:self.xMax + self.relPos.x, y:self.yMax + self.relPos.y};
		
		//con.log("position: " + self.position.x + " " + self.position.y);
		
		self.container.style.left = utility.truncate(self.position.x,0) + "px";
		self.container.style.top = utility.truncate(self.position.y,0) + "px";
	}
	
	this.setVelocity = function (vel) {
		//con.log("velX: " + vel.x + " velY: " + vel.y);
		self.velocity = vel;
	}

	this.setAcceleration = function (acc) {

		self.acceleration = acc;
	}

	this.hide = function () {

		$(this.container).hide();
	}
	
	this.setPosition(this.relPos);
}