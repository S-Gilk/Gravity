class Ship {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.z = 0;
		this.ax = 0;
		this.ay = 0;
		this.az = 0;
		this.vx = 0;
		this.vy = 0;
		this.vz = 0;
		this.d = [];
		this.posHistory = [];
		this.colorC = [];
		this.colorHistory = [];
		this.noseLength = 20;
	}

	show() {
		stroke(255);
		strokeWeight(1);
		noFill()
		strokeJoin(MITER);
		angleMode(DEGREES);

		if (this.vx >= 0 && this.vy <= 0) { // 1st Quad
			var direction = (atan2(this.vy, this.vx) * -1);
			var rotation = 45 - direction;
			beginShape();
			vertex(this.x - this.noseLength * cos(rotation), this.y - this.noseLength * sin(rotation));
			vertex(this.x, this.y);
			vertex(this.x - this.noseLength * sin(rotation), this.y + this.noseLength * cos(rotation));
			endShape();
		} else if (this.vx <= 0 && this.vy <= 0) { // 2nd Quad
			var direction = (atan2(this.vy, this.vx) * -1) - 90;
			var rotation = 45 - direction;
			beginShape();
			vertex(this.x - this.noseLength * sin(rotation), this.y + this.noseLength * cos(rotation));
			vertex(this.x, this.y);
			vertex(this.x + this.noseLength * cos(rotation), this.y + this.noseLength * sin(rotation));
			endShape();
		} else if (this.vx <= 0 && this.vy >= 0) { // 3rd Quad
			var direction = (atan2(this.vy, this.vx) - 180) * -1;
			var rotation = 45 - direction;
			beginShape();
			vertex(this.x + this.noseLength * cos(rotation), this.y + this.noseLength * sin(rotation));
			vertex(this.x, this.y);
			vertex(this.x + this.noseLength * sin(rotation), this.y - this.noseLength * cos(rotation));
			endShape();
		} else if (this.vx >= 0 && this.vy >= 0) { // 4th Quad
			var direction = atan2(this.vy, this.vx);
			var rotation = 45 - direction;
			beginShape();
			vertex(this.x - this.noseLength * sin(rotation), this.y - this.noseLength * cos(rotation));
			vertex(this.x, this.y);
			vertex(this.x - this.noseLength * cos(rotation), this.y + this.noseLength * sin(rotation));
			endShape();
		}


		if (this.x > width || this.x < 0) {
			this.vx = 0;
			this.vy = 0;
		} else if (this.y < 0 || this.y > height) {
			this.vy = 0;
			this.vx = 0;
		}

		// Implement gravitational acceleration on ship due to planets if in sphere of infuence.
		for (var i = 0; i < planets.length; i++) {
			this.d[i] = int(dist(planets[i].x, planets[i].y, ships[0].x, ships[0].y));
			if (this.d[i] < planets[i].SOI / 2) {
				if (ships[0].x >= planets[i].x && ships[0].y <= planets[i].y) { //1st Quad
					ships[0].ax = -0.00005 * ((planets[i].mu) / (this.d[i] ^ 3)) * ships[0].x;
					ships[0].ay = 0.00005 * ((planets[i].mu) / (this.d[i] ^ 3)) * ships[0].y;
				} else if (ships[0].x <= planets[i].x && ships[0].y <= planets[i].y) { //2nd Quad
					ships[0].ax = 0.00005 * ((planets[i].mu) / (this.d[i] ^ 3)) * ships[0].x;
					ships[0].ay = 0.00005 * ((planets[i].mu) / (this.d[i] ^ 3)) * ships[0].y;
				} else if (ships[0].x <= planets[i].x && ships[0].y >= planets[i].y) { //3rd Quad
					ships[0].ax = 0.00005 * ((planets[i].mu) / (this.d[i] ^ 3)) * ships[0].x;
					ships[0].ay = -0.00005 * ((planets[i].mu) / (this.d[i] ^ 3)) * ships[0].y;
				} else { //4th Quad
					ships[0].ax = -0.00005 * ((planets[i].mu) / (this.d[i] ^ 3)) * ships[0].x;
					ships[0].ay = -0.00005 * ((planets[i].mu) / (this.d[i] ^ 3)) * ships[0].y;
				}
			} else {
				ships[0].ax = 0;
				ships[0].ay = 0;
			}
			this.vx = this.vx + this.ax;
			this.vy = this.vy + this.ay;
			this.x = this.x + this.vx;
			this.y = this.y + this.vy;
		}

		// Gravitational attraction of ship to moons.
		for (var i = 0; i < moons.length; i++) {
			this.d[i] = int(dist(moons[i].x, moons[i].y, ships[0].x, ships[0].y));
			if (this.d[i] < moons[i].SOI / 2) {
				if (ships[0].x >= moons[i].x && ships[0].y <= moons[i].y) { //1st Quad
					ships[0].ax = -0.0001 * ((moons[i].mu) / (this.d[i] ^ 3)) * ships[0].x;
					ships[0].ay = 0.0001 * ((moons[i].mu) / (this.d[i] ^ 3)) * ships[0].y;
				} else if (ships[0].x <= moons[i].x && ships[0].y <= moons[i].y) { //2nd Quad
					ships[0].ax = 0.0001 * ((moons[i].mu) / (this.d[i] ^ 3)) * ships[0].x;
					ships[0].ay = 0.0001 * ((moons[i].mu) / (this.d[i] ^ 3)) * ships[0].y;
				} else if (ships[0].x <= moons[i].x && ships[0].y >= moons[i].y) { //3rd Quad
					ships[0].ax = 0.0001 * ((moons[i].mu) / (this.d[i] ^ 3)) * ships[0].x;
					ships[0].ay = -0.0001 * ((moons[i].mu) / (this.d[i] ^ 3)) * ships[0].y;
				} else { //4th Quad
					ships[0].ax = -0.0001 * ((moons[i].mu) / (this.d[i] ^ 3)) * ships[0].x;
					ships[0].ay = -0.0001 * ((moons[i].mu) / (this.d[i] ^ 3)) * ships[0].y;
				}
			} else {
				ships[0].ax = 0;
				ships[0].ay = 0;
			}
			this.vx = this.vx + this.ax;
			this.vy = this.vy + this.ay;
			this.x = this.x + this.vx;
			this.y = this.y + this.vy;
		}

		// Some interaction with other planet. Planet 1 is the one with correct gravity. Loop order??

		// Use a Kepler solver for dynamics.
		// for (var i = 0; i < planets.length; i++) {
		// 	this.r = [planets[i].x - this.x, planets[i].y - this.y, 0]; // Define spacecraft position.
		// 	this.v = [this.vx, this.vy, 0]; // Define spacecraft velocity.
		// 	this.hX = (this.r[1] * this.v[2]) - (this.r[2] * this.v[1]);
		// 	this.hY = (this.r[2] * this.v[0]) - (this.r[0] * this.v[2]);
		// 	this.hZ = (this.r[0] * this.v[1]) - (this.r[1] * this.v[0]);
		// 	// Calculate spacecraft specific angular momentum.
		// 	this.eX = (this.vx * this.hX / planets[i].mu) - this.r[0] / (sqrt((this.r[0] ^ 2) + (this.r[1] ^ 2) + (this.r[2] ^ 2))); // X comp of eccentricity vector.
		// 	this.eY = (this.vy * this.hY / planets[i].mu) - this.r[1] / (sqrt((this.r[0] ^ 2) + (this.r[1] ^ 2) + (this.r[2] ^ 2))); // Y comp of eccentricity vector.
		// 	this.eZ = (this.vz * this.hZ / planets[i].mu) - this.r[2] / (sqrt((this.r[0] ^ 2) + (this.r[1] ^ 2) + (this.r[2] ^ 2))); // Z comp of eccentricity vector.
		// 	this.e = sqrt((this.eX ^ 2) + (this.eY ^ 2) + (this.eZ ^ 2)); // Magnitude of eccentrity vector.
		// 	this.magH = sqrt((this.hX ^ 2) + (this.hY ^ 2) + this.hZ ^ 2); // Calculate the magnitude of specific angular momentum.
		// 	this.p = ((this.magH) ^ 2) / (planets[i].mu); // Calculate the semi-latus rectum.
		// 	this.a = (this.p) / (1 - this.e ^ 2); // Calculate the semi-major axis.
		// 	this.Ix = [1, 0, 0];
		// 	this.Iy = [0, 1, 0];
		// 	this.Iz = [0, 0, 1];
		// 	this.n = [(this.Iz[1] * this.hZ) - (this.Iz[2] * this.hY),
		// 		(this.Iz[2] * this.hX) - (this.Iz[0] * this.hZ),
		// 		(this.Iz[0] * this.hY) - (this.Iz[1] * this.hX)
		// 	]; // I am dum. This is undefined in 2D.
		// 	this.Omega = PI; // Longitude of the ascending node is undefined. Arbitrary.
		// 	this.inclination = 0; // Orbit is equatorial with planet.
		// 	this.w = 0; // Undefined in 2D.
		// 	this.hCrossE = [(this.hY * this.eZ) - (this.hZ * this.eY),
		// 		(this.hZ * this.eX) - (this.hX * this.eZ),
		// 		(this.hX * this.eY) - (this.hY * this.eX)
		// 	];
		// 	this.nu = atan2((-1 * (this.r[0] * this.hCrossE[0] + this.r[1] * this.hCrossE[1])), (-1 * this.magH) * ((this.r[0] * this.eX) + (this.r[1] * this.eY))) + PI;
		// }
	}

	launch() {
		this.vx = this.vx + map(launchVx, -width, width, -2, 2);
		this.vy = this.vy + map(launchVy, -height, height, -2, 2);
	}

	trail() {
		if (this.posHistory.length > 1000) {
			this.posHistory.splice(0, 1);
			this.colorHistory.splice(0, 1);
		}
		this.r = min(int(this.d));
		this.posC = createVector(this.x, this.y);
		this.posHistory.push(this.posC);
		this.colorC = int(map(this.r, 0, width / 2, 0, 255));
		this.colorHistory.push(this.colorC);
		for (let i = 5; i < this.posHistory.length; i++) {
			var pos = this.posHistory[i - 5];
			noStroke();
			colorMode(HSB, 100);
			fill(this.colorHistory[i], this.colorHistory[i], this.colorHistory[i]);
			ellipse(pos.x, pos.y, 2, 2);
			colorMode(RGB, 255);
			// vertex(pos.x, pos.y); // Super cool look into this. With beginShape() and endShape() after loop.
		}
	}


}