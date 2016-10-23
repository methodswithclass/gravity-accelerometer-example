
var content = "#container";
var utility;

$(document).ready(function() {


	var arena = document.createElement("div");
	$(arena).addClass("absolute fill");
	$(content).append(arena);


	utility = new Utility();
	var obj = new Obj(arena);
	var accel = new Accelerometer(master.params, obj);

	obj.show();

	accel.getMotion(function (position, velocity, acceleration) {
				
		obj.setPosition(position);
		obj.setVelocity(velocity);
		obj.setAcceleration(acceleration);

	});
	
	window.ondevicemotion = accel.motion;

	accel.start();


});