<html>

<head>

	<link rel="stylesheet" href="http://code.methodswithclass.com/api/classes.css">

	<script src="js/jquery-1.11.3.min.js"></script>
	<script src="js/angular.min.js"></script>

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
			size:200,
			color:"black"
		}

		$(document).ready(function () {

			var g = mcaccel.global;

			g.setFactor(g.const.factorS, 0.0001);
			g.setAxis(g.const.x, -1);

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

				//console.log("set position", pos.x, "   ", pos.y);

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

</head>

<body ng-app="accelerometer">

	<div class="absolute fill black-back">
		<div class="absolute width95 height95 center white-back lowered-dark" id="arena">
			<div id="object"></div>
		</div>
	</div>

	<console ng-attr-vis="hide"></console>


	<script src="js/app.js"></script>
	<script src="http://code.methodswithclass.com/api/console-1.js"></script>
	<!-- <script src="http://code.methodswithclass.com/api/accelerometer-1.js"></script> -->
	<script src="js/accelerometer-1.js"></script>
	

</body>

</html>