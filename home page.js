function homepage_set(){
	for (i = 0; i < 100; i++) {
		pauls.push(new Paul());
	}
}

function homepage_draw(){
	for (let paul of pauls) {
		paul.run();
	}
}



function Paul() {
	this.pos = createVector(random(width), random(height));
	this.vel = p5.Vector.random2D();
	this.vel.setMag(random(2, 4));
	this.acc = createVector(0, 0);
	this.maxForce = 0.1;
	this.maxSpeed = 4;

	this.r = 20;
	this.ang = 0;
	this.angle = 0;

	this.run = function() {
		this.update();
		this.applyForce();
		this.edges();
		this.display();
	}

	this.update = function() {
		this.vel.add(this.acc);
		this.vel.limit(this.maxSpeed)
		this.pos.add(this.vel);
		this.acc.mult(0);

		this.angle = this.vel.heading() + PI / 2
	}

	this.applyForce = function() {
		let alignment = this.align(pauls);
		let cohesion = this.cohesion(pauls);
		let separation = this.separation(pauls);
		let separation2 = this.separation2();

		alignment.mult(1);
		cohesion.mult(1);
		separation.mult(1);
		separation2.mult(2);

		// alignment.mult(alignSlider.value());
		// cohesion.mult(cohesionSlider.value());
		// separation.mult(separationSlider.value());

		this.acc.add(separation);
		this.acc.add(separation2);
		this.acc.add(alignment);
		this.acc.add(cohesion);
	}

	//separation 分离-避开拥挤的群
	this.separation = function() {
		let perception = 50;
		let steering = createVector(); //average
		let total = 0;
		for (let other of pauls) {
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

	//separation 分离-避开拥挤的群
	this.separation2 = function() {
		let perception = 200;
		let steering = createVector(); //average

		let target = createVector(mouseX, mouseY);

		let di = dist(target.x, target.y, this.pos.x, this.pos.y);
		if (di < perception) {
			let diff = p5.Vector.sub(this.pos, target)
			diff.div(di)
			steering.add(diff); //推动this远离other
		}
		if (di < perception) {
			steering.setMag(this.maxSpeed);
			steering.sub(this.vel);
			steering.limit(this.maxForce);
		}
		return steering;
	}


	//alignment 对齐
	this.align = function() {
		let perception = 50;
		let steering = createVector(); //average
		let total = 0;
		for (let other of pauls) {
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
		for (let other of pauls) {
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
	this.display = function() {
		PAUL(this.pos.x, this.pos.y, this.angle, 20, 1)
	}

}
