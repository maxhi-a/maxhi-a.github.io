function clock_draw() {
	background(220);

	let a = mis / 14
	let m = Math.round(a)
	// strokeWeight(1);
	// text(mi,100,100);

	//second
	let sra = ra - 13;
	let sx = cos(radians(sra)) * 360;
	let sy = sin(radians(sra)) * 360;
	//minute
	let mx = cos(radians(m * 6)) * 260;
	let my = sin(radians(m * 6)) * 260;
	//hour
	let hx = cos(radians(hou * 30)) * 200;
	let hy = sin(radians(hou * 30)) * 200;


	push();
	translate(width / 2 - 10, height / 2 + 10);
	stroke(200);
	strokeWeight(3)
	line(0, 0, sx, sy);
	line(sx * -0.1, sy * -0.1, 0, 0);
	fill(200)
	ellipse(sx * -0.1, sy * -0.1, 30, 30)
	rotate(radians(270))
	stroke(200);
	strokeWeight(6)
	line(0, 0, mx, my);
	stroke(200)
	strokeWeight(12)
	line(0, 0, hx, hy);
	pop();

	push();
	translate(width / 2, height / 2);
	for (let c of clock) {
		let t = c.arrive();
		c.applyForce(t);
		c.update();
		c.run();
		c.display();
	}
	stroke('blue');
	strokeWeight(3)
	line(0, 0, sx, sy);
	line(sx * -0.1, sy * -0.1, 0, 0);
	fill('blue')
	ellipse(sx * -0.1, sy * -0.1, 30, 30)
	rotate(radians(270))
	stroke('yellow');
	strokeWeight(6)
	line(0, 0, mx, my);
	stroke('red')
	strokeWeight(12)
	line(0, 0, hx, hy);
	pop();
}

function clock_set() {
	for (i = 0; i < 60; i++) {
		let x = random(width);
		let y = random(height);
		let p = new clockPaul(x, y);
		clock.push(p)
	}
}

function clockPaul(x, y) {
	this.h = random(60, 350);
	this.tx = cos(radians(0)) * this.h;
	this.ty = sin(radians(0)) * this.h;
	this.t = createVector(this.tx, this.ty)

	this.pos = createVector(x, y);
	this.vel = createVector(0, 0);
	this.acc = createVector(0, 0);
	this.r = 4;
	this.maxForce = 0.25;
	this.maxSpeed = 6;

	this.num = 0;

	this.tail = []

	this.tailsize = random(100, 360);

	this.angle = 0;


	this.update = function() {
		this.vel.add(this.acc);
		this.vel.limit(this.maxSpeed);
		this.pos.add(this.vel);
		this.acc.set(0, 0);
		let poscopy = p5.Vector.copy(this.pos);
		this.tail.push(poscopy)
		if (this.tail.length > this.tailsize) {
			this.tail.shift();
		}

	}

	this.applyForce = function(force) {
		this.acc.add(force);
	}

	this.arrive = function() {

		this.tx = cos(radians(ra)) * this.h;
		this.ty = sin(radians(ra)) * this.h;
		this.t = createVector(this.tx, this.ty)

		let force = p5.Vector.sub(this.t, this.pos);
		let slowRadius = 160;
		let distance = force.mag();
		if (distance < slowRadius) {
			let desiredSpeed = map(distance, 0, slowRadius, 0, this.maxSpeed);
			force.setMag(desiredSpeed)
		} else {
			force.setMag(this.maxSpeed);
		}

		force.sub(this.vel);
		force.limit(this.maxForce);
		return force;
	}

	this.safedistance = function() {
		for (let other of clock) {
			if (this != other) {
				let bv = p5.Vector.sub(this.pos, other.pos).normalize().mult(1.5);
				let di = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
				if (di < this.r) {
					this.pos.add(bv);
					other.pos.sub(bv);
				}
			}
		}
	}


	this.run = function() {

		let angle2 = degrees(this.t.angleBetween(this.pos));

		// push()
		// // strokeWeight(1);
		// text(angle2,100,300)
		// pop()

		if (angle2 < 14 && angle2 > -14) {
			this.num = 1;
		} else {
			this.num = 0;
		}

		let mx = map(mouseX, 0, width, -400, 400);
		let my = map(mouseY, 0, height, -300, 300);
		let mos = createVector(mx, my);
		let cen = createVector(0, 1);
		mos.sub(cen)
		mos.normalize();
		this.angle = degrees(this.t.angleBetween(mos));

		if (mouseIsPressed && this.angle!=0) {
			ra += this.angle;
			this.tx = cos(radians(ra)) * this.h;
			this.ty = sin(radians(ra)) * this.h;
			this.t = createVector(this.tx, this.ty);
		}

		if (this.angle < -179 && this.angle > 179) {
			ra = 0;
		}
		if (min > 699) {
			hou++;
			mis = 0;
		}
		if (hou > 12) {
			hou = 1;
		}
		if (ra > 269 && ra < 270) {
			mis++
		}

		switch (this.num) {
			case (1):
				this.tx = cos(radians(ra)) * this.h;
				this.ty = sin(radians(ra)) * this.h;
				this.t = createVector(this.tx, this.ty);
				if (ra > 359 && ra < 361) {
					ra = 0
				}
				ra += 0.1;
				break;
			case (0):
				this.tx = cos(radians(ra)) * this.h;
				this.ty = sin(radians(ra)) * this.h;
				this.t = createVector(this.tx, this.ty);
				ra += 0;
				break;
		}
		this.safedistance();
	}

	this.display = function() {
		stroke('white');
		strokeWeight(2);
		noFill();
		beginShape();
		for (i = 0; i < this.tail.length; i++) {
			vertex(this.tail[i].x, this.tail[i].y)
		}
		endShape();
		push();
		PAUL(this.pos.x, this.pos.y, this.vel.heading() + PI / 2, 20,1)
		pop();
	}
}