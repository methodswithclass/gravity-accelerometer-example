# accelerometer

jQuery is a dependency

js/index.js contains usage

accel.getMotion() takes a callback to attach position, velocity, and acceleration from the accel object to the movable object on screen.

must attach accel.motion() to the window.ondevicemotion function, this is the heart of the mechanism to detect device motion.

for proper usage, a calibration mechanism should be implemented. different devices have different coordinate systems and sensetivities. 
