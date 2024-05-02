function spotlight_draw() {
	bc = lerpColor(bright, dark, ck);
	background(bc);

	for (let blood of splashbloods) {
		blood.display();
	}

	for (i = 0; i < SpotLights.length; i++) {
		let s = SpotLights[i];

		if (s.boold < 1) {
			let x = s.pos.x;
			let y = s.pos.y;
			let b = new splashBlood(x, y)
			splashbloods.push(b);

		}

		if (s.boold < 0 && s.num == 1) {
			SpotLights.splice(i, 1);
		}
	}

	for (let paul of SpotLights) {
		paul.run();
	}


	for (i = 0; i < SpotLights.length; i++) {
		let paul = SpotLights[i];
		if (paul.num == 1) {
			ck += 0.05;
			let light = createVector(width / 2, -20)
			SpotLight(paul.pos, light, 120);
		}
	}

	if (ck > 1) {
		ck = 1
	}
	push();
	noFill();
	stroke(200, 0, 0, 20);
	strokeWeight(2);
	line(mouseX, mouseY - 20, mouseX, mouseY + 20, )
	line(mouseX + 20, mouseY, mouseX - 20, mouseY, )
	circle(mouseX, mouseY, 20);
	stroke('white');
	circle(mouseX, mouseY, 36);
	stroke('red');
	line(mouseX, mouseY + 20, mouseX, mouseY + 26)
	line(mouseX, mouseY - 20, mouseX, mouseY - 26)
	line(mouseX + 20, mouseY, mouseX + 26, mouseY)
	line(mouseX - 20, mouseY, mouseX - 26, mouseY)
	// line(mouseX+20,mouseY,mouseX-20,mouseY,)
	pop();
}

function spotlight_set() {
	for (i = 0; i < 100; i++) {
		SpotLights.push(new spotlightPaul());
	}
}

function splashBlood(x, y) {
	this.x = x;
	this.y = y;
	this.r = random(20, 50);
	this.add = 0;

	this.ox = this.x + random(-this.r * 2, this.r * 2);
	this.oy = this.y + random(-this.r * 2, this.r * 2);
	this.or = random(this.r / 6, this.r / 2);

	this.spr = []
	// for(i=0;i<12;i++){
	// 		this.spr.push({
	// 			x:this.ox,
	// 			y:this.oy,
	// 			r:this.or
	// 		})
	// 	}


	this.display = function() {
		push();
		noStroke();
		let from = color(0, 0, 220);
		let to = color(210);
		let interA = lerpColor(from, to, this.add);
		fill(interA)
		ellipse(this.x, this.y, this.r, this.r);
		ellipse(this.ox, this.oy, this.or, this.or);
		// for(i=0;i<this.spr.length;i++){

		// }

		this.add += 0.001;
		if (this.add > 1) {
			this.add = 1;
		}
		pop();
	}
}

function spotlightPaul() {
	this.pos = createVector(random(width), random(height));
	// this.vel=createVector(0,0);
	//p5.Vector.random2D(); 单位为一的随机方向的向量
	this.vel = p5.Vector.random2D();
	this.vel.setMag(random(2, 4));
	this.acc = createVector(0, 0);
	this.maxForce = 0.1;
	this.maxSpeed = 4;

	this.r = 20;
	this.ang = 0;
	this.angle = 0;
	this.soptlight = createVector(mouseX, mouseY);

	this.boold = 50;
	this.num = 0;

	this.emo;

	this.update = function() {
		this.vel.add(this.acc);
		this.vel.limit(this.maxSpeed)
		this.pos.add(this.vel);
		this.acc.mult(0);

		this.angle = this.vel.heading() + PI / 2
	}

	this.applyForce = function() {
		let alignment = this.align(SpotLights);
		let cohesion = this.cohesion(SpotLights);
		let separation = this.separation(SpotLights);

		alignment.mult(1.6);
		cohesion.mult(1);
		separation.mult(1.6);

		// alignment.mult(alignSlider.value());
		// cohesion.mult(cohesionSlider.value());
		// separation.mult(separationSlider.value());

		this.acc.add(separation);
		this.acc.add(alignment);
		this.acc.add(cohesion);
	}

	//separation 分离-避开拥挤的群
	this.separation = function() {
		let perception = 50;
		let steering = createVector(); //average
		let total = 0;
		for (let other of SpotLights) {
			let di = dist(other.pos.x, other.pos.y, this.pos.x, this.pos.y);
			//设定感知范围，此处设置为距离50以内
			if (other != this && di < perception) {
				//this位置减去other位置，得到一个指向this的向量
				let diff = p5.Vector.sub(this.pos, other.pos)
				//diff向量与距离成反比，也就是越近diff越大
				//推力越强
				diff.div(di)
				steering.add(diff); //推动this远离other
				total++;
			}
		}
		//steering=desired-velocity
		if (total > 0) {
			steering.div(total); //相加的位置除以总数=平均位置
			steering.setMag(this.maxSpeed);
			steering.sub(this.vel);
			steering.limit(this.maxForce);
			// steering.limit(0.03);
		}
		return steering;
	}

	//alignment 对齐
	this.align = function() {
		let perception = 50;
		let steering = createVector(); //average
		let total = 0;
		for (let other of SpotLights) {
			let di = dist(other.pos.x, other.pos.y, this.pos.x, this.pos.y);
			//设定感知范围，此处设置为距离50以内
			if (other != this && di < perception) {
				steering.add(other.vel); //速度相加
				total++;
			}
		}
		//steering=desired-velocity
		if (total > 0) {
			steering.div(total); //相加的速度除以总数=平均速度
			steering.setMag(this.maxSpeed);
			steering.sub(this.vel);
			steering.limit(this.maxForce);
		}
		return steering;
	}

	// cohesion 凝聚
	this.cohesion = function() {
		let perception = 50;
		let steering = createVector(); //average
		let total = 0;
		for (let other of SpotLights) {
			let di = dist(other.pos.x, other.pos.y, this.pos.x, this.pos.y);
			//设定感知范围，此处设置为距离50以内
			if (other != this && di < perception) {
				steering.add(other.pos); //位置相加
				total++;
			}
		}
		//steering=desired-velocity
		if (total > 0) {
			steering.div(total); //相加的位置除以总数=平均位置
			steering.sub(this.pos); //从当前位置指向平均位置的向量
			steering.setMag(this.maxSpeed);
			steering.sub(this.vel);
			steering.limit(this.maxForce);
		}
		return steering;
	}


	this.edges = function() {
		if (this.pos.x > width + 40) {
			this.pos.x = -40;
		} else if (this.pos.x < -40) {
			this.pos.x = width + 40
		}
		if (this.pos.y > height + 40) {
			this.pos.y = -40;
		} else if (this.pos.y < -40) {
			this.pos.y = height + 40
		}
	}

	//_________________分割线_________________

	this.move = function() {
		this.pos.add(this.vel);
		this.vel.mult(0.9);
	}

	this.hunt = function() {
		let targetsize = 60;
		this.soptlight = createVector(mouseX, mouseY)
		this.ang = atan2(this.soptlight.y - this.pos.y, this.soptlight.x - this.pos.x);
		let di = dist(this.soptlight.x, this.soptlight.y, this.pos.x, this.pos.y);
		if (di < targetsize / 2 + this.r * 2) {
			this.vel.x -= 1.2 * cos(this.ang) / 5;
			this.vel.y -= 1.2 * sin(this.ang) / 5;
		} else {
			this.vel.x += 1.2 * cos(this.ang) / 10;
			this.vel.y += 1.2 * sin(this.ang) / 10;
		}
		this.angle = this.ang + PI / 2
	}

	this.safedistance = function() {
		for (let other of SpotLights) {
			if (this != other) {
				let bv = p5.Vector.sub(this.pos, other.pos).normalize().mult(1.5);
				let di = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
				if (di < this.r * 2) {
					this.pos.add(bv);
					other.pos.sub(bv);
				}
			}
		}
	}

	this.escape = function() {
		this.soptlight = createVector(mouseX, mouseY)
		this.ang = atan2(this.soptlight.y - this.pos.y, this.soptlight.x - this.pos.x);
		this.vel.x -= 1.2 * cos(this.ang) / 5;
		this.vel.y -= 1.2 * sin(this.ang) / 5;
		this.angle = this.ang - PI / 2
	}

	//_________________分割线_________________



	this.stay = function() {
		let v1 = createVector(0, 1);
		let v2 = createVector(mouseX - this.pos.x, mouseY - this.pos.y);
		let angle = degrees(v1.angleBetween(v2));
		this.angle = radians(angle) - PI
	}

	this.run = function() {
		if (this.num != 1 && this.num != 2 && this.num != 3) {
			this.num = 0;
		}
		let di = dist(mouseX, mouseY, this.pos.x, this.pos.y);
		if (mouseIsPressed && di < this.r / 2) {
			this.num = 1;
		}
		if (anger > 0 && anger < 50 && this.num != 1) {
			this.num = 2;
		}

		if (anger < 0) {
			this.num = 3;
		}

		if (this.pos.x > width + 500 && this.num == 3) {
			this.pos.x = -40;
			this.num = 0;
		} else if (this.pos.x < -500 && this.num == 3) {
			this.pos.x = width + 40
			this.num = 0;
		}
		if (this.pos.y > height + 500 && this.num == 3) {
			this.pos.y = -40;
			this.num = 0;
		} else if (this.pos.y < -500 && this.num == 3) {
			this.pos.y = height + 40
			this.num = 0;
		}

		switch (this.num) {
			case (0):
				anger = 50;
				this.emo = 2;
				this.update();
				this.applyForce();
				this.edges();
				break;
			case (1):
				// let light=createVector(width/2,-20)
				// SpotLight(this.pos,light,60);
				this.emo = 3;
				anger -= 0.1;
				this.boold -= 0.1;
				this.pos.x = mouseX;
				this.pos.y = mouseY;
				this.stay();
				break;
			case (2):
				this.emo = 2;
				this.move();
				this.hunt();
				this.safedistance();
				break;
			case (3):
				ck -= 0.05;
				if (ck < 0) {
					ck = 0;
				}
				this.emo = 1;
				this.move();
				this.escape();
				this.safedistance();
				break;
		}
		this.display();
	}

	this.display = function() {
		PAUL(this.pos.x, this.pos.y, this.angle, 20, this.emo)
	}

}

function SpotLight(spot, light, radius) {
	noStroke();
	fill('black')

	let d = sqrt(pow(spot.x - light.x, 2) + pow(spot.y - light.y, 2));
	let vc1c2 = {
		x: light.x - spot.x,
		y: -light.y + spot.y,
	};
	let radC1C2 = acos(vc1c2.x / sqrt(pow(vc1c2.x, 2) + pow(vc1c2.y, 2)));
	let theta = acos(radius / d);
	if (light.y < spot.y) {
		let p1 = {
			x: spot.x + cos(theta + radC1C2) * radius,
			y: spot.y - sin(theta + radC1C2) * radius,
		};
		let p2 = {
			x: spot.x + cos(theta - radC1C2) * radius,
			y: spot.y + sin(theta - radC1C2) * radius,
		};
		let v = createVector(1, 0);
		let s = createVector(spot.x, spot.y);
		let v1 = createVector(p1.x, p1.y);
		let v2 = createVector(p2.x, p2.y);

		let sv1 = p5.Vector.sub(v1, s);
		let an1 = degrees(p5.Vector.angleBetween(v, sv1));
		let sv2 = p5.Vector.sub(v2, s);
		let an2 = degrees(p5.Vector.angleBetween(v, sv2));

		beginShape();
		if (an1 > 0) {
			vertex(0, 0);
			vertex(0, p1.y);
			vertex(p1.x, p1.y);
			vertex(light.x, light.y);
			for (let i = an2; i < 1; i++) {
				let posX = spot.x + cos(radians(i)) * radius;
				let posY = spot.y + sin(radians(i)) * radius;
				vertex(posX, posY);
			}
			vertex(width, spot.y + sin(0) * radius);
			vertex(width, 0);
		}
		if (an2 > 0) {
			vertex(light.x, light.y);
			vertex(p2.x, p2.y);
			vertex(width, p2.y);
			vertex(width, 0);
			vertex(0, 0);
			vertex(0, spot.y + sin(radians(180)) * radius);
			for (let i = -180; i < an1 + 1; i++) {
				let posX = spot.x + cos(radians(i)) * radius;
				let posY = spot.y + sin(radians(i)) * radius;
				vertex(posX, posY);
			}
		}
		if (an2 < 0 && an1 < 0) {
			vertex(0, 0);
			vertex(0, spot.y + sin(radians(180)) * radius);
			for (let i = -180; i < an1 + 1; i++) {
				let posX = spot.x + cos(radians(i)) * radius;
				let posY = spot.y + sin(radians(i)) * radius;
				vertex(posX, posY);
			}
			vertex(light.x, light.y);
			for (let i = an2; i < 1; i++) {
				let posX = spot.x + cos(radians(i)) * radius;
				let posY = spot.y + sin(radians(i)) * radius;
				vertex(posX, posY);
			}
			vertex(width, spot.y + sin(0) * radius);
			vertex(width, 0);

		}
		endShape(CLOSE);

		beginShape();
		if (an1 > 0) {
			vertex(0, p1.y);
			vertex(0, height);
			vertex(width, height);
			vertex(width, spot.y + sin(0) * radius);
			for (let i = 0; i < an1 + 1; i++) {
				let posX = spot.x + cos(radians(i)) * radius;
				let posY = spot.y + sin(radians(i)) * radius;
				vertex(posX, posY);
			}
		}
		if (an2 > 0) {
			vertex(0, spot.y + sin(radians(180)) * radius);
			vertex(0, height);
			vertex(width, height);
			vertex(width, p2.y);
			for (let i = an2; i < 181; i++) {
				let posX = spot.x + cos(radians(i)) * radius;
				let posY = spot.y + sin(radians(i)) * radius;
				vertex(posX, posY);
			}
		}
		if (an2 < 0 && an1 < 0) {
			vertex(0, spot.y + sin(radians(180)) * radius);
			vertex(0, height);
			vertex(width, height);
			vertex(width, spot.y + sin(0) * radius);
			for (let i = 0; i < 181; i++) {
				let posX = spot.x + cos(radians(i)) * radius;
				let posY = spot.y + sin(radians(i)) * radius;
				vertex(posX, posY);
			}

		}
		endShape(CLOSE);
	} else {
		radC1C2 = PI - radC1C2;
		let p1 = {
			x: spot.x + cos(PI - theta - radC1C2) * radius,
			y: spot.y + sin(PI - theta - radC1C2) * radius,
		};
		let p2 = {
			x: spot.x + cos(PI - (theta - radC1C2)) * radius,
			y: spot.y - sin(PI - (theta - radC1C2)) * radius,
		};
		let v = createVector(1, 0);
		let s = createVector(spot.x, spot.y);
		let v1 = createVector(p1.x, p1.y);
		let v2 = createVector(p2.x, p2.y);

		let sv1 = p5.Vector.sub(v1, s);
		let an1 = degrees(p5.Vector.angleBetween(v, sv1));
		let sv2 = p5.Vector.sub(v2, s);
		let an2 = degrees(p5.Vector.angleBetween(v, sv2));

		beginShape();
		if (an1 > 0) {
			vertex(light.x, light.y);
			vertex(p2.x, p2.y);
			vertex(0, p2.y);
			vertex(0, height);
			vertex(width, height);
			vertex(width, spot.y + sin(0) * radius);
			for (let i = 0; i < an1 + 1; i++) {
				let posX = spot.x + cos(radians(i)) * radius;
				let posY = spot.y + sin(radians(i)) * radius;
				vertex(posX, posY);
			}
		}
		if (an2 > 0) {
			vertex(light.x, light.y);
			for (let i = an2; i < 181; i++) {
				let posX = spot.x + cos(radians(i)) * radius;
				let posY = spot.y + sin(radians(i)) * radius;
				vertex(posX, posY);
			}
			vertex(0, spot.y + sin(0) * radius)
			vertex(0, height);
			vertex(width, height);
			vertex(width, p1.y);
			vertex(p1.x, p1.y);
		}
		endShape(CLOSE);

		beginShape();
		if (an1 > 0) {
			for (let i = an2; i < 1; i++) {
				let posX = spot.x + cos(radians(i)) * radius;
				let posY = spot.y + sin(radians(i)) * radius;
				vertex(posX, posY);
			}
			vertex(width, spot.y + sin(0) * radius);
			vertex(width, 0)
			vertex(0, 0);
			vertex(0, spot.y + sin(radians(an2)) * radius);
		}
		if (an2 > 0) {
			for (let i = -180; i < an1 + 1; i++) {
				let posX = spot.x + cos(radians(i)) * radius;
				let posY = spot.y + sin(radians(i)) * radius;
				vertex(posX, posY);
			}
			vertex(width, spot.y + sin(radians(an1)) * radius)
			vertex(width, 0);
			vertex(0, 0);
			vertex(0, spot.y + sin(radians(-180)) * radius)
		}
		if (an2 > 0 && an1 > 0) {
			for (let i = -180; i < 1; i++) {
				let posX = spot.x + cos(radians(i)) * radius;
				let posY = spot.y + sin(radians(i)) * radius;
				vertex(posX, posY);
			}
		}
		endShape(CLOSE);
	}
}