let m;
let pauls = []

let page;
let side;
//------bubble------
let blods = []
let springs = [];
let particles = [];
let bubble = [];
let upW, upH;
let downW, downH;
let grid;
let si;
let que;

//------clock------
let clock = [];
let target;
let mis;
let hou;
var ra;

//------spotlight------
let gap = 12
let SpotLights = []
let splashbloods = []
let back;
let anger = 50;
let dark;
let bright;
let bc
let ck;

function setup() {
	createCanvas(windowWidth, windowHeight);
	// noCursor();
	bw = width / 20
	bh = height / 20

	if (bw > bh) {
		left_button = {
			x: bw,
			y: height-bw,
			r: bw
		}
	} else {
		left_button = {
			x: bw * 3,
			y: height-bw*2,
			r: bw * 2
		}
	}

	button1 = {
		x: width / 2,
		y: bh * 9,
		w: bw * 8,
		h: bh * 3
	};
	button2 = {
		x: width / 2,
		y: bh * 9 + bh * 4,
		w: bw * 8,
		h: bh * 3
	};
	button3 = {
		x: width / 2,
		y: bh * 9 + bh * 8,
		w: bw * 8,
		h: bh * 3
	};

	m = 0

	page = 0;
	// side=0;
	// noCursor();
	homepage_set();

	//------bubble------
	que = -1;
	grid = sqrt(pow(width, 2) + pow(height, 2)) / 60

	if (width > height) {
		upW = width - (grid * 2);
		upH = (height * 0.8) - (grid * 1.5);
		downW = width - (grid * 2);
		downH = (height * 0.2) - (grid * 1.5);
	} else {
		upW = width - (grid * 2);
		upH = (height * 0.88) - (grid * 1.5);
		downW = width - (grid * 2);
		downH = (height * 0.12) - (grid * 1.5);
	}
	bubble_set();

	//------clock------
	ra = 150;
	mis = 0;
	hou = 0;
	clock_set()

	//------spotlight------
	dark = color(255, 255, 0);
	bright = color(220);
	ck = 0;
	spotlight_set();

}

function draw() {
	background(220);
	push();
	rectMode(CENTER);
	stroke(220);
	fill(255);
	let round = 20
	rect(button1.x, button1.y, button1.w, button1.h, round)
	rect(button2.x, button2.y, button2.w, button2.h, round)
	rect(button3.x, button3.y, button3.w, button3.h, round)
	pop();
	
	switch (page) {
		case (0):
			homepage_draw();
			pagebutton();
			break;
		case (1):
			backhome();
			bubbled_draw();
			fill('red')
			circle(left_button.x, left_button.y, left_button.r)
			break;
		case (2):
			backhome();
			clock_draw();
			fill('red')
			circle(left_button.x, left_button.y, left_button.r)
			break;
		case (3):
			backhome();
			spotlight_draw();
			fill('red')
			circle(left_button.x, left_button.y, left_button.r)
			break;
	}
}

function backhome() {
	let ldi = dist(mouseX, mouseY, left_button.x, left_button.y)
	if (mouseIsPressed && ldi < left_button.r) {
		page = 0;
	}
}

function pagebutton() {
	if (mouseIsPressed && mouseX > button1.x - button1.w / 2 && mouseX < button1.x + button1.w / 2 &&
		mouseY > button1.y - button1.h / 2 && mouseY < button1.y + button1.h / 2) {
		page = 1;
	}
	if (mouseIsPressed && mouseX > button2.x - button2.w / 2 && mouseX < button2.x + button2.w / 2 &&
		mouseY > button2.y - button2.h / 2 && mouseY < button2.y + button2.h / 2) {
		page = 2;
	}
	if (mouseIsPressed && mouseX > button3.x - button3.w / 2 && mouseX < button3.x + button3.w / 2 &&
		mouseY > button3.y - button3.h / 2 && mouseY < button3.y + button3.h / 2) {
		page = 3;
	}
}

function Oval(x, y, w, h, num) {
	push()
	translate(x, y);
	scale(3, 1)
	if (num == 0) {
		beginShape();
		vertex(0 + w * 2, 0)
		for (let i = 0; i < 181; i++) {
			posX = cos(radians(i));
			posY = sin(radians(i));
			vertex(posX * w, posY * w);
		}
		vertex(0 - w * 2, 0)
		vertex(0 - w * 2, h)
		vertex(0 + w * 2, h)
		endShape(CLOSE);
	}
	if (num == 1) {
		beginShape();
		for (let i = 0; i < 181; i++) {
			posX = cos(radians(i));
			posY = sin(radians(i));
			vertex(posX * w, posY * w);
		}
		endShape();
	}
	if (num == 3) {
		beginShape();
		vertex(0 + w, -h)
		vertex(0 - w, -h)
		for (let j = 180; j < 361; j++) {
			posX = cos(radians(j));
			posY = sin(radians(j));
			vertex(posX * w, posY * w);
		}
		endShape();
	}
	pop();
}

//_________________分割线_________________

function PAUL(x, y, r, Usize, num) {
	// let b=color('white')
	let b = color('white')
	noStroke();

	let ra = 13 + (sin(m) * 13)
	let la = (Usize / 8) + (sin(m) * (Usize / 8))

	let ldX = cos(radians(135)) * Usize / 2;
	let ldY = sin(radians(135)) * Usize / 2;

	let ldX2 = cos(radians(135 - ra)) * Usize;
	let ldY2 = sin(radians(135 - ra)) * Usize;

	let rdX = cos(radians(45)) * Usize / 2;
	let rdY = sin(radians(45)) * Usize / 2;

	let rdX2 = cos(radians(45 + ra)) * Usize;
	let rdY2 = sin(radians(45 + ra)) * Usize;

	let luX = cos(radians(90)) * Usize / 2;
	let luY = sin(radians(90)) * Usize / 2;

	let luX2 = cos(radians(90)) * ((Usize * 0.75) + la);
	let luY2 = sin(radians(90)) * ((Usize * 0.75) + la);

	push();
	translate(x, y);
	rotate(r);
	rectMode(CENTER);
	stroke('gray');
	strokeWeight(Usize / 4)
	rect(0, 0, Usize * 1.6, Usize * 0.8, Usize)
	ellipse(0, 0 - sin(m) / 2, Usize, Usize);
	strokeWeight(Usize / 2)
	line(ldX, ldY + Usize / 4, ldX2, ldY2)
	line(rdX, rdY + Usize / 4, rdX2, rdY2)
	line(luX, luY + Usize / 6, luX2, luY2)

	stroke(b);
	strokeWeight(Usize / 4)
	line(ldX, ldY + Usize / 4, ldX2, ldY2)
	line(rdX, rdY + Usize / 4, rdX2, rdY2)

	noStroke();
	fill(b);
	rect(0, 0, Usize * 1.6, Usize * 0.8, Usize)
	ellipse(0, 0 - sin(m) / 2, Usize, Usize);

	//eyes
	fill(0);
	// ellipse(0,0,Usize*0.8,Usize*0.8)
	ellipse(Usize * 0.225, 0, Usize * 0.55, Usize * 0.55)
	ellipse(Usize * -0.225, 0, Usize * 0.55, Usize * 0.55)
	//pupil
	fill(b);
	// Eye(width/2,height/2,0,0,Usize)
	Eye(width / 2, height / 2, Usize * 0.225, 0, Usize)
	Eye(width / 2, height / 2, -Usize * 0.225, 0, Usize)
	if (num == 1) {
		// eyebrow
		fill(b)
		rect(0, -Usize / 6, Usize, Usize / 4)
	}
	if (num == 2) {
		//anger
		noFill();
		stroke(b)
		strokeWeight(Usize / 3.64);
		beginShape();
		vertex(Usize / 2, -Usize / 4)
		vertex(0, -Usize / 15)
		vertex(-Usize / 2, -Usize / 4)
		endShape();
	}
	if (num == 3) {
		//sad
		noFill();
		stroke(b)
		strokeWeight(Usize / 3.64);
		beginShape();
		vertex(Usize / 2, -Usize / 15)
		vertex(0, -Usize / 4)
		vertex(-Usize / 2, -Usize / 15)
		endShape();
	}
	if (num == 4) {
		fill(b);
		ellipse(Usize * 0.225, 0, Usize * 0.55, Usize * 0.55)
		ellipse(Usize * -0.225, 0, Usize * 0.55, Usize * 0.55)
		//eyes
		fill(0);
		// ellipse(0,0,Usize*0.8,Usize*0.8)
		ellipse(Usize * 0.225, Usize / 16, Usize * 0.55, Usize * 0.55)
		ellipse(Usize * -0.225, Usize / 16, Usize * 0.55, Usize * 0.55)
		//pupil
		fill(b);
		// Eye(width/2,height/2,0,0,Usize)
		Eye(width / 2, height / 2, Usize * 0.225, Usize / 16, Usize)
		Eye(width / 2, height / 2, -Usize * 0.225, Usize / 16, Usize)
		//joy
		fill(b);
		rect(0, Usize / 4, Usize, Usize / 4)
	}
	stroke(b);
	strokeWeight(Usize / 4)
	line(luX, luY + Usize / 6, luX2, luY2)

	m += 0.005;
	if (m == 360) {
		m = 0
	}
	pop();
}

function Eye(tx, ty, x, y, s) {
	push();
	let mosx = map(mouseX, 0, width, -tx, width - tx)
	let mosy = map(mouseY, 0, height, -ty, height - ty)
	translate(x, y);
	let an = atan2(mosy - y, mosx - x)
	rotate(an)
	// ellipse(0,0,s*0.6,s*0.6)
	ellipse(0, 0, s * 0.33, s * 0.33)
	pop();
}