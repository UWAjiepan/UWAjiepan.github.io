let t = 0, dt = 1 / 50;
let blue = '#5F9EA0', orange = '#ffb403';

function setup() {
    createCanvas(700, 750).parent('canvas');
    frameRate(30);
    fill('#ffffff');
    stroke(blue);
}

function draw() {
    background(255);
    drawClamps();
    drawDiagram();
    drawMode1();
    drawMode2();
    drawMode3();

    if (focused) t += dt;
}

function drawClamps() {
    for (let i = 0; i < 4; i++) {
        push();
        stroke('#ffff66');
        fill('#ffff66');
        ellipse(70, 60 + i * 150, 60, 120);
        ellipse(85, 60 + i * 150, 60, 120);
        stroke(orange);
        fill(orange);
        ellipse(90, 60 + i * 150, 60, 120);
        fill('#ffffff');
        stroke('#ffffff');
        rect(100, 30 + i * 150, 20, 60);
        pop();
    }
}

function drawDiagram() {
    push();
    stroke('#ffff66');
    fill('#ffff66');
    ellipse(70, 60, 60, 120);
    ellipse(85, 60, 60, 120);
    stroke(orange);
    fill(orange);
    ellipse(90, 60, 60, 120);
    fill('#ffffff');
    stroke('#ffffff');
    rect(100, 30, 20, 60);
    pop();
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
        let s = (40 * Math.sin(HALF_PI * i / 20) * Math.cos(0.25 * t * TWO_PI));
        arc(100 + i * 25 - s, 210, 30, 60, HALF_PI, 3 * HALF_PI);
    }
    let s20 = (40 * Math.sin(HALF_PI * 20 / 20) * Math.cos(0.25 * t * TWO_PI));
    ellipse(600 - s20, 210, 30, 60);
    line(100, 180, 600 - s20, 180);
    line(100, 240, 600 - s20, 240);
}

function drawMode2() {
    for (let i = 0; i < 20; i++) {
        let s = (40 * Math.sin(3 * HALF_PI * i / 20) * Math.cos(0.75 * t * TWO_PI));
        arc(100 + i * 25 - s, 360, 30, 60, HALF_PI, 3 * HALF_PI)
    }
    let s20 = (40 * Math.sin(3 * HALF_PI * 20 / 20) * Math.cos(0.75 * t * TWO_PI));
    ellipse(600 - s20, 360, 30, 60);
    line(100, 330, 600 - s20, 330);
    line(100, 390, 600 - s20, 390);
}

function drawMode3() {
    for (let i = 0; i < 20; i++) {
        let s = (40 * Math.sin(5 * HALF_PI * i / 20) * Math.cos(1.25 * t * TWO_PI));
        arc(100 + i * 25 - s, 510, 30, 60, HALF_PI, 3 * HALF_PI)
    }
    let s20 = (40 * Math.sin(5 * HALF_PI * 20 / 20) * Math.cos(1.25 * t * TWO_PI));
    ellipse(600 - s20, 510, 30, 60);
    line(100, 480, 600 - s20, 480);
    line(100, 540, 600 - s20, 540);
}