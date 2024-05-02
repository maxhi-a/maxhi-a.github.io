function bubbled_draw() {
	background(0);
	noStroke();
	fill(203)
	beginShape();
	vertex(width / 2 - si / 14, upH - grid);
	vertex(width / 2 + si / 14, upH - grid);
	vertex(width / 2 + si / 12, height - grid * 3);
	vertex(width / 2 - si / 12, height - grid * 3);
	endShape(CLOSE);

	fill(0);
	ellipse(width / 2, height - grid * 3, si / 6, si / 18)

	fill(255);
	rect(grid, grid, upW, upH, 12);
	fill(234);
	rect(grid * 2, grid * 2, upW - grid * 2, upH - grid * 3, 12);

	fill(203)
	ellipse(width / 2, upH - grid, si / 7, si / 21)

	// fill('blue')
	// ellipse(width / 2, height/2, si/6, si/6)

	noFill();
	stroke(203);
	strokeWeight(grid / 4);
	ellipse(width / 2, height - grid * 3, si / 6, si / 18)

	// noStroke();
	// fill(234);
	// Oval(width / 2, upH - grid, si / 18, grid * 2, 3)
	// noFill();

	// PAUL(x,y,r,Usize,num)

	for (let b of blods) {
		b.run();
		// b.state();
		b.display();
		PAUL(b.cpos.x, b.cpos.y, b.ang + PI / 2, grid * 1.2, 4)
		// PAUL((b.max_x + b.min_x) / 2, (b.max_y + b.min_y) / 2, b.ang + PI / 2, grid * 1.2, 4)
	}

	noStroke();
	// fill('red');
	fill(255);
	Oval(width / 2, upH - grid, si / 42, grid * 2, 0)
	noFill();

	for (let b of bubble) {
		b.run();
		b.display();
	}

	for (let i = 0; i < bubble.length; i++) {
		let p = bubble[i];
		let di = dist(p.position.x, p.position.y, width / 2, height + 200)
		if (di < 10) {
			bubble.splice(i, 1);
			que++;

			let newx = width / 2;
			let newy = height + upH / 2 * que;
			knum = 0;
			let newb = new Blob(newx, newy, si / 13);
			newb.update();
			blods.push(newb);
		}
	}

	if (que > 12) {
		que = 0;
	}

	// push();
	// stroke('blue')
	// strokeWeight(1);
	// text(que,200,200)
	// pop();

	noStroke();
	// fill('red');
	fill(0);
	Oval(width / 2, height - grid * 3, si / 36, grid * 4, 0)
	noFill();
	stroke(203);
	strokeWeight(grid / 12);
	Oval(width / 2, height - grid * 3, si / 36, grid * 4, 1)
}


function bubble_set() {
	if (width > height) {
		si = upW
	} else {
		si = upW * 2
	}

	for (let i = 0; i < 10; i++) {
		let newx = width / 2;
		let newy = height + upH / 2 * i;
		let newb = new Blob(newx, newy, si / 13);
		newb.update();
		blods.push(newb);
	}
}

function mousePressed() {
	for (let i = 0; i < blods.length; i++) {
		let b = blods[i];
		// let di = dist(mouseX, mouseY, (b.max_x + b.min_x) / 2, (b.max_y + b.min_y) / 2)
		let di = dist(mouseX, mouseY, b.cpos.x, b.cpos.y)
		if (di < b.r) {
			// b.cpos.x, b.cpos.y
			let xin = b.cpos.x;
			let yin = b.cpos.y;
			// let xin = b.max_x;
			// let yin = b.min_y;
			let r = b.ang + PI / 2;
			let p = new bubblePaul(xin, yin, r);
			bubble.push(p);
			blods.splice(i, 1);
		}
	}
}


function bubblePaul(xin, yin, angle) {
	// this.c = c;
	this.begin = createVector(random(width), -20)
	this.endpos = createVector(width / 2, height - grid * 4);
	this.exponent = random(4, 12);
	this.position = createVector(xin, yin)
	// this.step=random(0.005,0.01);
	this.step = 0.003;
	this.pct = 0;
	this.tail = []
	this.r = 20
	this.angle = angle;
	this.pos = createVector();
	this.vel = createVector(0, 0);

	this.emotext = 1000;
	this.num = 0;
	this.s = 0;

	this.maxForce = 6;
	this.maxSpeed = 6;

	this.update = function() {
		let pos = p5.Vector.copy(this.position);



		this.begin = this.position;

		this.distx = this.endpos.x - this.begin.x;
		this.disty = this.endpos.y - this.begin.y;

		this.pct += this.step
		if (this.pct < 1.0) {
			this.position.x = this.begin.x + (pow(this.pct, this.exponent) * this.distx);
			this.position.y = this.begin.y + (this.pct * this.disty);
		}

		let v1 = createVector(0, 1);
		let v2 = p5.Vector.sub(pos, this.position);
		this.angle = degrees(v1.angleBetween(v2));
		this.angle = radians(this.angle);
		this.pos = p5.Vector.copy(this.position);
	}

	this.arrive = function() {
		let pos = p5.Vector.copy(this.position);

		let target = createVector(width / 2, height + 200);
		let force = p5.Vector.sub(target, this.pos);
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
		this.position.add(force)

		let v1 = createVector(0, 1);
		let v2 = p5.Vector.sub(pos, this.position);
		this.angle = degrees(v1.angleBetween(v2));
		this.angle = radians(this.angle);
		this.pos = p5.Vector.copy(this.position);
	}

	this.run = function() {
		if (this.num != 1) {
			this.num = 0;
		}
		// ellipse(width / 2, height - grid * 3, si / 6, si / 18)
		let di = dist(this.position.x, this.position.y, width / 2, height - grid * 4)
		if (di < si / 18) {
			this.num = 1;
		}
		switch (this.num) {
			case (0):
				this.update();
				break;
			case (1):
				this.arrive();
				break;
		}

	}

	this.display = function() {
		push();
		PAUL(this.position.x, this.position.y, this.angle, grid * 1.2, 3)
		pop();
	}
}



function Blob(x, y, r) {
	this.x = x;
	this.y = y;
	this.r = r;
	this.cpos = createVector(0, 0);
	this.ang = 0;
	// this.cx=0;
	// this.cy=0;
	this.particles = [];
	this.springs = [];
	this.spacing = 21;

	this.num = 0;


	this.max_x = 0;
	this.max_y = 0;
	this.min_x = 0;
	this.min_y = 0;

	this.update = function() {
		for (i = 0; i < this.spacing; i++) {
			let posx = this.x + cos(2 * PI / this.spacing * i) * this.r;
			let posy = this.y + sin(2 * PI / this.spacing * i) * this.r;
			let p = new Particle(posx, posy);
			this.particles.push(p);
		}

		for (let pa = 0; pa < this.particles.length; pa++) {
			for (let pb = pa + 1; pb < this.particles.length; pb++) {
				let a = this.particles[pa];
				let b = this.particles[pb];
				let len = dist(a.pos.x, a.pos.y, b.pos.x, b.pos.y)
				let s = new Spring(len, a, b)
				this.springs.push(s);
			}
		}
		particles.push(...this.particles)
	}


	this.run = function() {
		for (let s of this.springs) {
			s.update();
		}



		for (let p of this.particles) {
			p.update();
			p.run(this.num);
			p.Collision();
			// p.display();
		}
	}

	this.display = function() {
		// let ac = createVector((this.max_x + this.min_x) / 2, (this.max_y + this.min_y) / 2)
		// let poco = p5.Vector.copy(ac);

		let poco = p5.Vector.copy(this.cpos);

		beginShape();
		fill('blue')
		stroke('blue');
		strokeWeight(si / 104);
		for (let p of this.particles) {
			curveVertex(p.pos.x, p.pos.y)
		}
		for (let p of this.particles) {
			curveVertex(p.pos.x, p.pos.y)
		}
		endShape();
		for (let i = 0; i < this.particles.length; i++) {
			// stroke('red')
			let a = 3;
			let b = 10
			let c = 17
			this.cpos.x = (this.particles[a].pos.x + this.particles[b].pos.x + this.particles[c].pos.x) / 3
			this.cpos.y = (this.particles[a].pos.y + this.particles[b].pos.y + this.particles[c].pos.y) / 3
		}
		this.ang = atan2(this.cpos.y - poco.y, this.cpos.x - poco.x);

		let posx = []
		let posy = []
		for (let i = 0; i < this.particles.length; i++) {
			posx.push(this.particles[i].pos.x)
			posy.push(this.particles[i].pos.y)
		}

		this.max_x = max(posx);
		this.max_y = max(posy);
		this.min_x = min(posx);
		this.min_y = min(posy);
		if (this.max_y > upH - grid) {
			this.num = 0;
		} else {
			this.num = 1;
		}
		// noFill();
		// stroke('red');
		// strokeWeight(2);
		// line(this.min_x, this.max_y, this.max_x, this.max_y)
		// this.ang = atan2((this.max_y + this.min_y) / 2 - poco.y, (this.max_x + this.min_x) / 2 - poco.x);

	}
}


function Spring(restLength, particleA, particleB) {
	// this.ks = 0.01;
	// this.kd = 0.005;
	this.ks = 0.03;
	this.kd = 0.007;
	// this.ks = 0.1;
	// this.kd = 0.03;
	this.rl = restLength;
	this.a = particleA;
	this.b = particleB;

	this.update = function() {
		let Fs = p5.Vector.sub(this.b.pos, this.a.pos).mag();
		Fs = (Fs - this.rl) * this.ks

		let Fd = p5.Vector.sub(this.b.pos, this.a.pos).normalize();
		Fd = p5.Vector.dot(Fd, p5.Vector.sub(this.b.vel, this.a.vel)) * this.kd;
		let force = Fs + Fd;

		let forceA = p5.Vector.sub(this.b.pos, this.a.pos).normalize();
		forceA = p5.Vector.mult(forceA, force)
		let forceB = p5.Vector.sub(this.a.pos, this.b.pos).normalize();
		forceB = p5.Vector.mult(forceB, force)

		this.a.applyForce(forceA);
		this.b.applyForce(forceB);
	}

	this.display = function() {
		push();
		stroke(220).strokeWeight(1);
		line(this.a.pos.x, this.a.pos.y, this.b.pos.x, this.b.pos.y);
		pop();
	}
}

function Particle(x, y) {
	this.pos = createVector(x, y);
	this.vel = p5.Vector.random2D();
	this.vel.setMag(random(5, 6));
	// this.vel = createVector(0, 0);
	this.acc = createVector(0, 0);
	this.mass = 1;
	this.maxspeed = 12;
	// this.r = upH / 56;
	this.r = si / 104;

	// this.num = 0;

	this.applyForce = function(force) {
		let f = force.copy();
		f.div(this.mass);
		this.acc.add(f);
	}

	this.update = function() {
		this.vel.add(this.acc);
		this.vel.limit(this.maxspeed)
		this.pos.add(this.vel);
		this.acc.set(0, 0);
	}


	this.run = function(num) {
		switch (num) {
			case (0):
				this.up();
				break;
			case (1):
				this.wall();
				break;
		}
	}

	this.up = function() {
		this.acc.y -= 0.005;
		if (this.pos.x + this.r / 2 > width / 2 + (si / 14)) {
			this.pos.x = width / 2 + (si / 14) - this.r / 2
			this.vel.x *= -1
		}
		if (this.pos.x - this.r / 2 < width / 2 - (si / 14)) {
			this.pos.x = width / 2 - (si / 14) + this.r / 2
			this.vel.x *= -1
		}
	}

	this.wall = function() {
		if (this.pos.x + this.r / 2 > width - (grid * 1.5)) {
			this.pos.x = width - this.r / 2 - (grid * 1.5)
			this.vel.x *= -1
		}
		if (this.pos.x - this.r / 2 < grid * 1.5) {
			this.pos.x = this.r / 2 + (grid * 1.5)
			this.vel.x *= -1
		}
		if (this.pos.y + this.r / 2 > upH - grid) {
			this.pos.y = upH - grid - this.r / 2
			this.vel.y *= -1
		}
		if (this.pos.y - this.r / 2 < grid * 1.5) {
			this.pos.y = this.r / 2 + grid * 1.5
			this.vel.y *= -1
		}
	}

	this.Collision = function() {
		for (let other of particles) {
			if (this != other) {
				let distance = this.pos.dist(other.pos);
				// if (distance != 0) {
				let minDistance = this.r + other.r;
				if (distance <= minDistance) {
					let normal = p5.Vector.sub(other.pos, this.pos).normalize();
					let relativeVelocity = p5.Vector.sub(other.vel, this.vel);
					let impulse = p5.Vector.mult(normal, 2 * p5.Vector.dot(relativeVelocity, normal) / (1 + 1));

					let repulsion = p5.Vector.mult(normal, minDistance - distance);

					this.vel.add(p5.Vector.div(impulse, 1));
					other.vel.sub(p5.Vector.div(impulse, 1));

					this.pos.sub(p5.Vector.div(repulsion, 1));
					other.pos.add(p5.Vector.div(repulsion, 1));
				}
				// }
			}
		}
	}

	this.display = function() {
		push();
		stroke(220).strokeWeight(1);
		// fill('blue')
		ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
		pop();
	}
}