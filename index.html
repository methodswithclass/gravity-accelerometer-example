<html>

<head>

	<link rel="stylesheet" href="http://code.methodswithclass.com/api/classes.css">

	<script src="js/jquery-1.11.3.min.js"></script>

	<script>

	//accelerometer calculation and integration parameters
	var params = {
		interval:2,
		filterSize:3,
		factor:1,
		mu:0.1,
		damp:0.4,
		gravity:true,
		bounce:true
	}

	//object parameters, shape is only dependent value, other values can be used to change how the object looks, or it can be hardcoded
	var objParams = {
		shape:"circle",
		size:100,
		color:"black"
	}

	$(document).ready(function () {

		var obj = new mcaccel.object({
			name:"object",
			object:$("#object")[0],
			params:objParams
		});
			
		var accel = new mcaccel.accelerometer({
			name:"accel",
			object:obj,
			params:params
		});

		accel.getMotion(function (pos, vel, accel) {

			obj.setPosition(pos);
			obj.setVelocity(vel);
			obj.setAcceleration(accel);

		});

		//rubber meets road
		window.ondevicemotion = accel.motion;

		//begin integrating for device position and updating position of object
		accel.reset();
		accel.start();

	});

	</script>

	<style>

	</style>

</head>

<body>

	<div class="absolute fill black-back">
		<div class="absolute width95 height95 center white-back lowered-dark" id="arena">
			<div id="object"></div>
		</div>
	</div>


	<!-- <script src="http://wcode.methodswithclass.com/api/accelerometer-1.js"></script> -->
	<script src="js/accelerometer-1.js"></script>
	

</body>

</html>