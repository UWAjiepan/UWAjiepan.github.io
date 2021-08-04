let t = 0, dt = 1 / 60;
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
    arc(100, 60, 30, 60, HALF_PI, 3 * HALF_PI);
    ellipse(600, 60, 30, 60);
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
    arc(100, 160, 30, 60, HALF_PI, 3 * HALF_PI);
    ellipse(600, 160, 30, 60);
    line(100, 130, 600, 130);
    line(100, 190, 600, 190);
    for (let i = 0; i < 18; i++) {
        let b = Math.PI - Math.PI * i / 9;
        for (let j = 0; j < 40; j++) {
            let t0 = (Math.PI / 4.5) * Math.cos(Math.PI * j / 40) * Math.cos(0.25 * t * TWO_PI);
            let t1 = (Math.PI / 4.5) * Math.cos(Math.PI * (j + 1) / 40) * Math.cos(0.25 * t * TWO_PI);
            if (j === 39) {
                line(600, 160, 100 + (j * 12.8) - (30 * Math.cos(b + t1) * Math.cos(Math.PI / 3)), 160 + 30 * Math.sin(b + t1))
            }
            if (b + t1 < HALF_PI && b + t1 > -HALF_PI) {
                line(100 + j * 12.5 - (30 * Math.cos(b + t0) * Math.cos(Math.PI / 3)), 160 + (30 * Math.sin(b + t0)), 100 + (j + 1) * 12.5 - (30 * Math.cos(b + t1) * Math.cos(Math.PI / 3)), 160 + (30 * Math.sin(b + t1)));
            }
        }
    }
}

function drawMode2() {
    arc(100, 260, 30, 60, HALF_PI, 3 * HALF_PI);
    ellipse(600, 260, 30, 60);
    line(100, 230, 600, 230);
    line(100, 290, 600, 290);
    for (let i = 0; i < 18; i++) {
        let b = Math.PI - Math.PI * i / 9;
        for (let j = 0; j < 40; j++) {
            let t0 = (Math.PI / 4.5) * Math.cos(2 * Math.PI * j / 40) * Math.cos(0.5 * t * TWO_PI);
            let t1 = (Math.PI / 4.5) * Math.cos(2 * Math.PI * (j + 1) / 40) * Math.cos(0.5 * t * TWO_PI);
            if (j === 39) {
                line(600, 260, 100 + (j * 12.8) - (30 * Math.cos(b + t1) * Math.cos(Math.PI / 3)), 260 + 30 * Math.sin(b + t1))
            }
            if (b + t1 < HALF_PI && b + t1 > -HALF_PI) {
                line(100 + j * 12.5 - (30 * Math.cos(b + t0) * Math.cos(Math.PI / 3)), 260 + (30 * Math.sin(b + t0)), 100 + (j + 1) * 12.5 - (30 * Math.cos(b + t1) * Math.cos(Math.PI / 3)), 260 + (30 * Math.sin(b + t1)));
            }
        }
    }
}

function drawMode3() {
    arc(100, 360, 30, 60, HALF_PI, 3 * HALF_PI);
    ellipse(600, 360, 30, 60);
    line(100, 330, 600, 330);
    line(100, 390, 600, 390);
    for (let i = 0; i < 18; i++) {
        let b = Math.PI - Math.PI * i / 9;
        for (let j = 0; j < 40; j++) {
            let t0 = (Math.PI / 4.5) * Math.cos(3 * Math.PI * j / 40) * Math.cos(0.75 * t * TWO_PI);
            let t1 = (Math.PI / 4.5) * Math.cos(3 * Math.PI * (j + 1) / 40) * Math.cos(0.75 * t * TWO_PI);
            if (j === 39) {
                line(600, 360, 100 + (j * 12.8) - (30 * Math.cos(b + t1) * Math.cos(Math.PI / 3)), 360 + 30 * Math.sin(b + t1))
            }
            if (b + t1 < HALF_PI && b + t1 > -HALF_PI) {
                line(100 + j * 12.5 - (30 * Math.cos(b + t0) * Math.cos(Math.PI / 3)), 360 + (30 * Math.sin(b + t0)), 100 + (j + 1) * 12.5 - (30 * Math.cos(b + t1) * Math.cos(Math.PI / 3)), 360 + (30 * Math.sin(b + t1)));
            }
        }
    }
}