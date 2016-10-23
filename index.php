<html>

<head>

	<link rel="stylesheet" href="http://code.methodswithclass.com/api/classes.css">

	<script src="http://code.methodswithclass.com/api/accelerometer-1.js"></script>
	<!-- <script src="js/accelerometer-1.js"></script> -->

	<script>

		(function () {

			setTimeout(function () {

				//accelerometer calculation and integration parameters
				var params = {
					interval:2,
					filterSize:3,
					factor:0.8,
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

				var g = mcaccel.utility;

				//these values must be set per session on different devices through some calibration means
				g.setFactor(g.const.factorG, 0.01);
				g.setAxis(g.const.x, -1);
				g.setAxis(g.const.y, 1);

				var object = document.getElementById("object");

				var obj = new mcaccel.object({
					id:"object",
					object:object,
					params:objParams
				});
					
				var accel = new mcaccel.accelerometer({
					id:"accel",
					object:obj,
					params:params
				});

				accel.getMotion("accel", function (id, pos, vel, acc) {

					console.log("set position", id, pos.x, "   ", pos.y);

					obj.setPosition(pos);
					obj.setVelocity(vel);
					obj.setAcceleration(acc);

				});

				//rubber meets road
				window.ondevicemotion = accel.motion;

				//begin integrating for device position and updating position of object
				accel.reset();
				accel.start();


			}, 500);

		})();

	</script>

</head>

<body>

	<div class="absolute fill black-back">
		<div class="absolute width95 height95 center white-back lowered-dark" id="arena">
			<div id="object"></div>
		</div>
	</div>

</body>

</html>