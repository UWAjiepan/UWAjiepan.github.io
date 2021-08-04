let t = 0, dt = 1 / 50;
let blue = '#5F9EA0', orange = '#FFA500';

function setup() {
    createCanvas(700, 410).parent('canvas');
    frameRate(30);
    noFill();
    stroke(blue);
}

function draw() {
    background(255);
    drawDiagram();
    drawMode1();
    drawMode2();
    drawMode3();

    if (focused) t += dt;
}

function drawDiagram() {
    for (let i = 0; i < 20; i++) {
        arc(100 + i * 25, 60, 30, 60, HALF_PI, 3 * HALF_PI)
    }
    ellipse(600, 60, 30, 60);
    line(100, 30, 600, 30);
    line(100, 90, 600, 90);
    push();
    stroke(orange);
    fill(orange);
    rect(600, 56, 20, 8);
    triangle(620, 56, 620, 64, 630, 60);
    pop();
}

function drawMode1() {
    for (let i = 0; i < 20; i++) {
        let s = 15 - (40 * Math.cos(PI * i / 20) * Math.cos(0.25 * t * TWO_PI));
        arc(100 + i * 25 - s, 160, 30, 60, HALF_PI, 3 * HALF_PI);
    }
    let s0 = 15 - (40 * Math.cos(0.25 * t * TWO_PI) * Math.cos(0));
    let s20 = 15 - (40 * Math.cos(0.25 * t * TWO_PI) * Math.cos(PI));
    ellipse(600 - s20, 160, 30, 60);
    line(100 - s0, 130, 600 - s20, 130);
    line(100 - s0, 190, 600 - s20, 190);
}

function drawMode2() {
    for (let i = 0; i < 20; i++) {
        let s = 15 - (40 * Math.cos(TWO_PI * i / 20) * Math.cos(0.5 * t * TWO_PI));
        arc(100 + i * 25 - s, 260, 30, 60, HALF_PI, 3 * HALF_PI)
    }
    let s0 = 15 - (40 * Math.cos(0.5 * t * TWO_PI) * Math.cos(0));
    let s20 = 15 - (40 * Math.cos(0.5 * t * TWO_PI) * Math.cos(TWO_PI));
    ellipse(600 - s20, 260, 30, 60);
    line(100 - s0, 230, 600 - s20, 230);
    line(100 - s0, 290, 600 - s20, 290);
}

function drawMode3() {
    for (let i = 0; i < 20; i++) {
        let s = -(40 * Math.cos(3 * PI * i / 20) * Math.cos(0.75 * t * TWO_PI));
        arc(100 + i * 25 - s, 360, 30, 60, HALF_PI, 3 * HALF_PI)
    }
    let s0 = -(40 * Math.cos(0.75 * t * TWO_PI) * Math.cos(0));
    let s20 = -(40 * Math.cos(0.75 * t * TWO_PI) * Math.cos(3 * PI));
    ellipse(600 - s20, 360, 30, 60);
    line(100 - s0, 330, 600 - s20, 330);
    line(100 - s0, 390, 600 - s20, 390);
}