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
    arc(100, 60, 30, 60, HALF_PI, 3 * HALF_PI);
    ellipse(600, 60, 30, 60);
    line(100, 30, 600, 30);
    line(100, 90, 600, 90);
    //bar lines
    line(100, 30, 600, 30);
    line(92, 35, 591, 35);
    line(89, 42, 588, 42);
    line(87, 50, 585, 50);
    line(85, 60, 615, 60);
    line(87, 70, 585, 70);
    line(89, 78, 588, 78);
    line(92, 85, 591, 85);
    line(100, 90, 600, 90);
    //radius lines
    line(586, 70, 614, 50);
    line(586, 50, 614, 70);
    line(589, 42, 612, 78);
    line(589, 78, 612, 42);
    line(592, 85, 609, 35);
    line(592, 35, 609, 85);
    line(596, 88, 605, 32);
    line(596, 32, 605, 88);
    line(600, 90, 600, 30);
    //force arrow
    push();
    stroke(orange);
    fill(orange);
    arc(630, 60, 20, 40, 2.75, -0.8);
    triangle(630, 51, 641, 47, 639, 57);
    stroke('#ffffff');
    fill('#ffffff');
    arc(631, 60, 10, 30, 2, 0);
    triangle(620, 64, 623, 56, 625, 63);
    stroke(orange);
    fill(orange);
    triangle(632, 50, 641, 46, 639, 57);
    pop();
}

function drawMode1() {
    arc(100, 210, 30, 60, HALF_PI, 3 * HALF_PI);
    ellipse(600, 210, 30, 60);
    line(100, 180, 600, 180);
    line(100, 240, 600, 240);
    for (let i = 0; i < 18; i++) {
        let b = Math.PI - Math.PI * i / 9;
        for (let j = 0; j < 40; j++) {
            let t0 = (Math.PI / 4.5) * Math.sin(HALF_PI * j / 40) * Math.cos(0.25 * t * TWO_PI);
            if (j === 0) t0 = 0;
            let t1 = (Math.PI / 4.5) * Math.sin(HALF_PI * (j + 1) / 40) * Math.cos(0.25 * t * TWO_PI);
            if (j === 39) {
                line(600, 210, 100 + (j * 12.8) - (30 * Math.cos(b + t1) * Math.cos(Math.PI / 3)), 210 + 30 * Math.sin(b + t1))
            }
            if (b + t1 < HALF_PI && b + t1 > -HALF_PI) {
                line(100 + j * 12.5 - (30 * Math.cos(b + t0) * Math.cos(Math.PI / 3)), 210 + (30 * Math.sin(b + t0)), 100 + (j + 1) * 12.5 - (30 * Math.cos(b + t1) * Math.cos(Math.PI / 3)), 210 + (30 * Math.sin(b + t1)));
            }
        }
    }
}

function drawMode2() {
    arc(100, 360, 30, 60, HALF_PI, 3 * HALF_PI);
    ellipse(600, 360, 30, 60);
    line(100, 330, 600, 330);
    line(100, 390, 600, 390);
    for (let i = 0; i < 18; i++) {
        let b = Math.PI - Math.PI * i / 9;
        for (let j = 0; j < 40; j++) {
            let t0 = (Math.PI / 4.5) * Math.sin(3 * HALF_PI * j / 40) * Math.cos(0.75 * t * TWO_PI);
            if (j === 0) t0 = 0;
            let t1 = (Math.PI / 4.5) * Math.sin(3 * HALF_PI * (j + 1) / 40) * Math.cos(0.75 * t * TWO_PI);
            if (j === 39) {
                line(600, 360, 100 + (j * 12.8) - (30 * Math.cos(b + t1) * Math.cos(Math.PI / 3)), 360 + 30 * Math.sin(b + t1))
            }
            if (b + t1 < HALF_PI && b + t1 > -HALF_PI) {
                line(100 + j * 12.5 - (30 * Math.cos(b + t0) * Math.cos(Math.PI / 3)), 360 + (30 * Math.sin(b + t0)), 100 + (j + 1) * 12.5 - (30 * Math.cos(b + t1) * Math.cos(Math.PI / 3)), 360 + (30 * Math.sin(b + t1)));
            }
        }
    }
}

function drawMode3() {
    arc(100, 510, 30, 60, HALF_PI, 3 * HALF_PI);
    ellipse(600, 510, 30, 60);
    line(100, 480, 600, 480);
    line(100, 540, 600, 540);
    for (let i = 0; i < 18; i++) {
        let b = Math.PI - Math.PI * i / 9;
        for (let j = 0; j < 40; j++) {
            let t0 = (Math.PI / 4.5) * Math.sin(5 * HALF_PI * j / 40) * Math.cos(1.25 * t * TWO_PI);
            if (j === 0) t0 = 0;
            let t1 = (Math.PI / 4.5) * Math.sin(5 * HALF_PI * (j + 1) / 40) * Math.cos(1.25 * t * TWO_PI);
            if (j === 39) {
                line(600, 510, 100 + (j * 12.8) - (30 * Math.cos(b + t1) * Math.cos(Math.PI / 3)), 510 + 30 * Math.sin(b + t1))
            }
            if (b + t1 < HALF_PI && b + t1 > -HALF_PI) {
                line(100 + j * 12.5 - (30 * Math.cos(b + t0) * Math.cos(Math.PI / 3)), 510 + (30 * Math.sin(b + t0)), 100 + (j + 1) * 12.5 - (30 * Math.cos(b + t1) * Math.cos(Math.PI / 3)), 510 + (30 * Math.sin(b + t1)));
            }
        }
    }
}