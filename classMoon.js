class Moon {
	constructor(x, y, r, mu, vx, vy) {
		this.x = x;
		this.y = y;
		this.vx = vx;
		this.vy = vy;
		this.ax = 0;
		this.ay = 0;
		this.r = r / 2;
		this.z = 50;
		this.mu = mu;
		this.SOI = this.mu * this.r * 10; // Sphere of influence is a function of the planet's gravitational parameter.
		this.px = [];
		this.py = [];
		this.pz = [];
		this.total = 75;
		this.posHistory = [];
		this.colorC = [];
		this.colorHistory = [];
		this.d = [];

		// for (var i = 0; i < this.total + 1; i++) {
		// 	this.px[i] = [];
		// 	this.py[i] = [];
		// 	this.pz[i] = [];
		// }
		// this.px[0] = this.x;
		// this.py[0] = this.y;
		// this.pz[0] = this.z;
		//
		// for (var i = 1; i < this.total + 1; i++) {
		// 	this.lat = map(i, 0, this.total, 0, 180);
		// 	for (var j = 1; j < this.total + 1; j++) {
		// 		this.lon = map(j, 0, this.total, 0, 360);
		// 		this.px[i][j] = this.d / 2 * sin(this.lat) * cos(this.lon);
		// 		this.py[i][j] = this.d / 2 * sin(this.lat) * sin(this.lon);
		// 		this.pz[i][j] = this.d / 2 * cos(this.lat);
		// 	}
		// }
	}



	show() {
		noStroke();
		fill(155, 20);
		ellipse(this.x, this.y, this.SOI, this.SOI);
		noStroke();
		fill(255, 0, 0);
		ellipse(this.x, this.y, this.r * 5, this.r * 5);

		// 	3 D Planets
		// 	Build Vectors
		//
		// 	for (var i = 0; i < this.total; i++) {
		// 		beginShape(TRIANGLE_STRIP);
		// 		for (var j = 0; j < this.total + 1; j++) {
		// 			this.hu = map(j, 0, this.total, 0, 255);
		// 			fill(0, 255, 0);
		// 			vertex(this.px[i][j], this.py[i][j], this.pz[i][j]);
		// 			vertex(this.px[i + 1][j], this.py[i + 1][j], this.pz[i + 1][j]);
		// 		}
		// 		endShape();
		// 	}
		// }
	}

	orbit() {
		for (var i = 0; i < planets.length; i++) {
			this.d[i] = int(dist(planets[i].x, planets[i].y, this.x, this.y) * 1000);
			if (this.d[i] > this.d[i - 1] || i == 0) {
				this.planetIndex = i;
			}
		}
		if (this.x >= planets[this.planetIndex].x && this.y <= planets[this.planetIndex].y) { //1st Quad
			this.ax = -0.08 * ((planets[this.planetIndex].mu) / (this.d[this.planetIndex] ^ 3)) * this.x;
			this.ay = 0.08 * ((planets[this.planetIndex].mu) / (this.d[this.planetIndex] ^ 3)) * this.y;
		} else if (this.x <= planets[this.planetIndex].x && this.y <= planets[this.planetIndex].y) { //2nd Quad
			this.ax = 0.08 * ((planets[this.planetIndex].mu) / (this.d[this.planetIndex] ^ 3)) * this.x;
			this.ay = 0.08 * ((planets[this.planetIndex].mu) / (this.d[this.planetIndex] ^ 3)) * this.y;
		} else if (this.x <= planets[this.planetIndex].x && this.y >= planets[this.planetIndex].y) { //3rd Quad
			this.ax = 0.08 * ((planets[this.planetIndex].mu) / (this.d[this.planetIndex] ^ 3)) * this.x;
			this.ay = -.08 * ((planets[this.planetIndex].mu) / (this.d[this.planetIndex] ^ 3)) * this.y;
		} else { //4th Quad
			this.ax = -.08 * ((planets[this.planetIndex].mu) / (this.d[this.planetIndex] ^ 3)) * this.x;
			this.ay = -.08 * ((planets[this.planetIndex].mu) / (this.d[this.planetIndex] ^ 3)) * this.y;
		}

		this.vx = this.vx + this.ax;
		this.vy = this.vy + this.ay;
		this.x = this.x + this.vx;
		this.y = this.y + this.vy;
	}


	trail() {

		if (this.posHistory.length > 1000) {
			this.posHistory.splice(0, 1);
			this.colorHistory.splice(0, 1);
		}

		this.posC = createVector(this.x, this.y);
		this.posHistory.push(this.posC);
		this.colorC = int(map(this.d / 2000, 0, width / 2, 0, 255));
		this.colorHistory.push(this.colorC);

		for (let i = 5; i < this.posHistory.length; i++) {
			var pos = this.posHistory[i - 5];
			colorMode(HSB, 100);
			fill(this.colorHistory[i], this.colorHistory[i], this.colorHistory[i]);
			ellipse(pos.x, pos.y, 2, 2);
			colorMode(RGB, 255);
			// vertex(pos.x, pos.y); // Super cool look into this. With beginShape() and endShape() after loop.
		}
	}
}