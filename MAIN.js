let ships = [];
let planets = [];
let moons = [];

var pressed = false;
var launchVx;
var launchVy;

function setup() {
	createCanvas(1920, 1080);
	ships[0] = new Ship(100, 200);
	planets[0] = new Planet(width / 2, height / 2, 12.742, 3.986004 * (10 ^ 14), 0, 0);
	planets[1] = new Planet(width / 2.5, height / 2.5, 12.742, 3.986004 * (10 ^ 14), 0, 0);
	moons[0] = new Moon((width / 2) + 205, (height / 2), 3.474, 4.90486959 * (10 ^ 12), 0, -0.88);
	moons[1] = new Moon((width / 2.5) + 205, (height / 2.5), 3.474, 4.90486959 * (10 ^ 12), 0, -0.88);
	background(0);
}


function draw() {
	if (pressed) {
		background(0);
		ships[0].show();
		ships[0].trail();
		for (let i = 0; i < planets.length; i++) {
			planets[i].show();
			planets[i].trail();
		}
		for (let i = 0; i < moons.length; i++) {
			moons[i].show();
			moons[i].orbit();
			moons[i].trail();
		}

		stroke(125);
		line(ships[0].posC.x, ships[0].posC.y, mouseX, mouseY);
	} else {
		background(0);
		ships[0].show();
		ships[0].trail();
		for (let i = 0; i < planets.length; i++) {
			planets[i].show();
			planets[i].trail();
		}
		for (let i = 0; i < moons.length; i++) {
			moons[i].show();
			moons[i].orbit();
			moons[i].trail();
		}
	}
}

function mouseDragged() {
	pressed = true;
}

function mouseReleased() {
	launchVx = mouseX - ships[0].x;
	launchVy = mouseY - ships[0].y;
	pressed = false;
	ships[0].launch();
}